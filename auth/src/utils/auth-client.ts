import { OAuth2Client } from 'google-auth-library';

class GoogleAuthClient {
  private authClient;
  constructor(client_id: string, client_secret: string, redirect_uri: string) {
    this.authClient = new OAuth2Client(client_id, client_secret, redirect_uri);
  }

  async getPayload(token: string) {
    try {
      const ticket = await this.authClient.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      if (!payload) {
        throw new Error('No payload found');
      }
      return payload;
    } catch (error) {
      console.error('Error verifying Google token:', error);
      throw new Error('Invalid token');
    }
  }
}

export { GoogleAuthClient };
