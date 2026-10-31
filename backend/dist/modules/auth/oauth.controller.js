import { oauthService } from './oauth.service.js';
export const OAuthController = {
    async getDiscovery(_req, res) {
        return res.status(200).json(oauthService.getDiscoveryDocument());
    },
    async getJwks(_req, res) {
        return res.status(200).json(oauthService.getJwks());
    },
    async authorize(req, res) {
        try {
            const { client_id, redirect_uri, scope, response_type, state, nonce } = req.query;
            if (!client_id || !redirect_uri || !scope || !response_type) {
                return res.status(400).json({ error: 'client_id, redirect_uri, scope, and response_type are required.' });
            }
            const result = await oauthService.authorize({
                client_id: client_id,
                redirect_uri: redirect_uri,
                scope: scope,
                response_type: response_type,
                state: state,
                nonce: nonce,
            });
            return res.redirect(result.redirectUrl);
        }
        catch (error) {
            return res.status(400).json({ error: error.message });
        }
    },
    async token(req, res) {
        try {
            const { grant_type, code, redirect_uri, client_id, client_secret, refresh_token } = req.body;
            const result = await oauthService.token({
                grant_type: grant_type,
                code: code,
                redirect_uri: redirect_uri,
                client_id: client_id,
                client_secret: client_secret,
                refresh_token: refresh_token,
            });
            return res.status(200).json(result);
        }
        catch (error) {
            return res.status(400).json({ error: error.message });
        }
    },
    async userinfo(req, res) {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({ error: 'Bearer token is required.' });
            }
            const accessToken = authHeader.slice(7);
            const userInfo = await oauthService.userinfo(accessToken);
            return res.status(200).json(userInfo);
        }
        catch (error) {
            return res.status(401).json({ error: error.message });
        }
    },
    async logout(req, res) {
        try {
            const authHeader = req.headers.authorization;
            const { user_id } = req.body;
            if (authHeader && authHeader.startsWith('Bearer ')) {
                const accessToken = authHeader.slice(7);
                await oauthService.revokeSession(accessToken);
            }
            if (user_id) {
                await oauthService.revokeAllSessions(user_id);
            }
            return res.status(200).json({ message: 'Logged out from all apps. Single sign-out complete.' });
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },
};
//# sourceMappingURL=oauth.controller.js.map