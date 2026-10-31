import { Request, Response } from 'express';
import { oauthService } from './oauth.service.js';

export const OAuthController = {
  async getDiscovery(_req: Request, res: Response) {
    return res.status(200).json(oauthService.getDiscoveryDocument());
  },

  async getJwks(_req: Request, res: Response) {
    return res.status(200).json(oauthService.getJwks());
  },

  async authorize(req: Request, res: Response) {
    try {
      const { client_id, redirect_uri, scope, response_type, state, nonce } = req.query;
      if (!client_id || !redirect_uri || !scope || !response_type) {
        return res.status(400).json({ error: 'client_id, redirect_uri, scope, and response_type are required.' });
      }

      const result = await oauthService.authorize({
        client_id: client_id as string,
        redirect_uri: redirect_uri as string,
        scope: scope as string,
        response_type: response_type as string,
        state: state as string,
        nonce: nonce as string,
      });

      return res.redirect(result.redirectUrl);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  },

  async token(req: Request, res: Response) {
    try {
      const { grant_type, code, redirect_uri, client_id, client_secret, refresh_token } = req.body;
      const result = await oauthService.token({
        grant_type: grant_type as string,
        code: code as string,
        redirect_uri: redirect_uri as string,
        client_id: client_id as string,
        client_secret: client_secret as string,
        refresh_token: refresh_token as string,
      });
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  },

  async userinfo(req: Request, res: Response) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Bearer token is required.' });
      }
      const accessToken = authHeader.slice(7);
      const userInfo = await oauthService.userinfo(accessToken);
      return res.status(200).json(userInfo);
    } catch (error: any) {
      return res.status(401).json({ error: error.message });
    }
  },

  async logout(req: Request, res: Response) {
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
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  },
};
