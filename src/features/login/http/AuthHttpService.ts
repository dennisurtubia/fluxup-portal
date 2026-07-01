import { HttpService } from '@/http/HttpService';

type LoginResponse = {
  access_token: string;
  token_type: string;
};

type RefreshResponse = {
  access_token: string;
  token_type: string;
};

type LoginData = {
  username: string;
  password: string;
};

export class AuthHttpService extends HttpService {
  async login({ username, password }: LoginData) {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    return this.post<LoginResponse, FormData>('/auth/token', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  /**
   * Requests a fresh access token. The backend only needs the Authorization
   * header (the same Bearer token every other request sends), which is added
   * automatically by the request interceptor in HttpService. The new token is
   * persisted so subsequent requests pick it up.
   */
  async refreshToken(): Promise<string> {
    const response = await this.post<RefreshResponse>('/auth/refresh_token');
    localStorage.setItem('token', response.access_token);
    return response.access_token;
  }
}

export const authServiceHttpServiceInstance = new AuthHttpService();
