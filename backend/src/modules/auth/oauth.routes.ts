import { Router } from 'express';
import { OAuthController } from './oauth.controller.js';

const router = Router();

// OIDC Discovery (RFC 8414)
router.get('/.well-known/openid-configuration', OAuthController.getDiscovery);

// JWKS (RFC 7517)
router.get('/.well-known/jwks.json', OAuthController.getJwks);

// OAuth 2.0 Authorization endpoint
router.get('/oauth/authorize', OAuthController.authorize);

// OAuth 2.0 Token endpoint
router.post('/oauth/token', OAuthController.token);

// OIDC UserInfo endpoint
router.get('/oauth/userinfo', OAuthController.userinfo);

// OAuth 2.0 Logout (Single Sign-Out)
router.post('/oauth/logout', OAuthController.logout);

export default router;
