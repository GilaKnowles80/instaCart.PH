import { Router } from 'express';
import { OAuthController } from './oauth.controller.js';
const router = Router();
router.get('/.well-known/openid-configuration', OAuthController.getDiscovery);
router.get('/.well-known/jwks.json', OAuthController.getJwks);
router.get('/oauth/authorize', OAuthController.authorize);
router.post('/oauth/token', OAuthController.token);
router.get('/oauth/userinfo', OAuthController.userinfo);
router.post('/oauth/logout', OAuthController.logout);
export default router;
//# sourceMappingURL=oauth.routes.js.map