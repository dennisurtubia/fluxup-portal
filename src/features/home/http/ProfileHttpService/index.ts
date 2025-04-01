import { HttpService } from '@/http/HttpService';

export type Profile = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

// TODO: REMOVE THIS SERVICE
export class ProfileService extends HttpService {
  async getProfile(userId: number) {
    return this.get<Profile>(`/todos/${userId}`);
  }
}

export const profileService = new ProfileService();
