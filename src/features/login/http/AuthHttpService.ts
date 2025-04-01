import { HttpService } from '@/http/HttpService';

type LoginResponse = {
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
}

export const authServiceHttpServiceInstance = new AuthHttpService();
