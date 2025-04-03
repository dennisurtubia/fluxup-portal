import { HttpService } from '@/http/HttpService';

export type TagType = {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
};

export type TagDataType = {
  name: string;
  description: string;
};

class TagHttpService extends HttpService {
  async getTags() {
    return this.get<TagType[]>('/tags');
  }

  async createTag(data: TagDataType) {
    return this.post('/tags', { ...data });
  }
}

export const TagHttpServiceInstance = new TagHttpService();
