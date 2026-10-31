import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import { UserRepository } from '../../db/repository.js';
import { UserAppRoleRepository } from '../../db/repository.js';
import { OAuthAuthorizationCodeRepository } from '../../db/repository.js';
import { OAuthSessionRepository } from '../../db/repository.js';
import { OAuthClientRepository } from '../../db/repository.js';
const KEY_PAIR = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
});
const ISSUER = process.env.OAUTH_ISSUER || 'https://api.instaCart.PH';
const ACCESS_TOKEN_TTL_SECONDS = 3600;
const AUTH_CODE_TTL_SECONDS = 600;
function generateCode() {
    return crypto.randomBytes(24).toString('base64url');
}
function generateSessionId() {
    return crypto.randomBytes(24).toString('base64url');
}
function hashToken(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
}
function signAccessToken(userId, clientId, scope) {
    return jwt.sign({ sub: userId, aud: clientId, iss: ISSUER, scope, type: 'access' }, KEY_PAIR.privateKey, { algorithm: 'RS256', expiresIn: ACCESS_TOKEN_TTL_SECONDS, keyid: 'instacart-rsa-1' });
}
function signIdToken(userId, clientId, nonce) {
    const payload = {
        sub: userId,
        aud: clientId,
        iss: ISSUER,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + ACCESS_TOKEN_TTL_SECONDS,
        type: 'id_token',
    };
    if (nonce)
        payload.nonce = nonce;
    return jwt.sign(payload, KEY_PAIR.privateKey, {
        algorithm: 'RS256',
        expiresIn: ACCESS_TOKEN_TTL_SECONDS,
        keyid: 'instacart-rsa-1',
    });
}
export const oauthService = {
    getDiscoveryDocument() {
        const base = ISSUER.replace(/\/+$/, '');
        return {
            issuer: ISSUER,
            authorization_endpoint: `${base}/oauth/authorize`,
            token_endpoint: `${base}/oauth/token`,
            userinfo_endpoint: `${base}/oauth/userinfo`,
            jwks_uri: `${base}/.well-known/jwks.json`,
            registration_endpoint: `${base}/oauth/register`,
            scopes_supported: ['openid', 'profile', 'email', 'phone', 'roles'],
            response_types_supported: ['code'],
            response_modes_supported: ['query', 'fragment'],
            grant_types_supported: ['authorization_code', 'refresh_token'],
            code_challenge_methods_supported: ['S256'],
            token_endpoint_auth_methods_supported: ['client_secret_basic', 'client_secret_post'],
            subject_types_supported: ['public'],
            id_token_signing_alg_values_supported: ['RS256'],
        };
    },
    getJwks() {
        const publicKey = KEY_PAIR.publicKey;
        const pem = publicKey.export({ type: 'spki', format: 'pem' });
        const b64 = pem
            .replace('-----BEGIN PUBLIC KEY-----', '')
            .replace('-----END PUBLIC KEY-----', '')
            .replace(/\s/g, '');
        return {
            keys: [
                {
                    kty: 'RSA',
                    kid: 'instacart-rsa-1',
                    use: 'sig',
                    alg: 'RS256',
                    n: b64,
                    e: 'AQAB',
                },
            ],
        };
    },
    async authorize(params) {
        if (params.response_type !== 'code') {
            throw new Error('Unsupported response_type. Only "code" is supported.');
        }
        const client = await OAuthClientRepository.findById(params.client_id);
        if (!client)
            throw new Error('Invalid client_id.');
        const code = generateCode();
        const expiresAt = new Date(Date.now() + AUTH_CODE_TTL_SECONDS * 1000).toISOString();
        await OAuthAuthorizationCodeRepository.create({
            id: `authcode_${generateCode()}`,
            code,
            userId: params.client_id,
            clientId: params.client_id,
            redirectUri: params.redirect_uri,
            scope: params.scope,
            expiresAt,
        });
        let redirectUrl = `${params.redirect_uri}?code=${code}&state=${params.state || ''}`;
        return { code, redirectUrl };
    },
    async token(params) {
        if (params.grant_type === 'authorization_code') {
            if (!params.code)
                throw new Error('Authorization code is required.');
            const record = await OAuthAuthorizationCodeRepository.findByCode(params.code);
            if (!record)
                throw new Error('Invalid or expired authorization code.');
            if (new Date(record.expires_at) < new Date()) {
                throw new Error('Authorization code has expired.');
            }
            if (record.client_id !== params.client_id) {
                throw new Error('Client ID mismatch.');
            }
            await OAuthAuthorizationCodeRepository.markUsed(params.code);
            const user = await UserRepository.findById(record.user_id);
            if (!user)
                throw new Error('User not found.');
            const accessToken = signAccessToken(user.id, params.client_id, record.scope);
            const idToken = signIdToken(user.id, params.client_id);
            const sessionId = generateSessionId();
            const sessionExpiresAt = new Date(Date.now() + ACCESS_TOKEN_TTL_SECONDS * 1000).toISOString();
            await OAuthSessionRepository.create({
                id: `sess_${sessionId}`,
                userId: user.id,
                appId: params.client_id,
                accessTokenHash: hashToken(accessToken),
                refreshTokenHash: null,
                expiresAt: sessionExpiresAt,
            });
            return {
                access_token: accessToken,
                id_token: idToken,
                token_type: 'Bearer',
                expires_in: ACCESS_TOKEN_TTL_SECONDS,
                scope: record.scope,
            };
        }
        if (params.grant_type === 'refresh_token') {
            if (!params.refresh_token)
                throw new Error('Refresh token is required.');
            throw new Error('Refresh token grant not yet implemented. Use authorization_code.');
        }
        throw new Error(`Unsupported grant_type: ${params.grant_type}`);
    },
    async userinfo(accessToken) {
        let payload;
        try {
            payload = jwt.verify(accessToken, KEY_PAIR.publicKey, {
                algorithms: ['RS256'],
            });
        }
        catch {
            throw new Error('Invalid or expired access token.');
        }
        if (payload.type !== 'access')
            throw new Error('Token is not an access token.');
        const tokenHash = hashToken(accessToken);
        const session = await OAuthSessionRepository.findByAccessTokenHash(tokenHash);
        if (!session)
            throw new Error('Session has been revoked. Please log in again.');
        const user = await UserRepository.findById(payload.sub);
        if (!user)
            throw new Error('User not found.');
        return {
            sub: user.id,
            email: user.email,
            email_verified: user.is_email_verified,
            name: user.full_name || `${user.first_name} ${user.last_name}`,
            given_name: user.first_name,
            family_name: user.last_name,
            phone_number: user.phone,
            role: user.role,
        };
    },
    async getAppRole(userId, appId) {
        const record = await UserAppRoleRepository.findByUserIdAndAppId(userId, appId);
        return record?.app_role || 'member';
    },
    async revokeAllSessions(userId) {
        await OAuthSessionRepository.revokeByUserId(userId);
        return { revoked: true, userId };
    },
    async revokeSession(accessToken) {
        const tokenHash = hashToken(accessToken);
        await OAuthSessionRepository.revokeByTokenHash(tokenHash);
        return { revoked: true };
    },
};
//# sourceMappingURL=oauth.service.js.map