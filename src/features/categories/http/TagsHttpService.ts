import { HttpService } from '@/http/HttpService';

export type TagsType = {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
};

export type TagsDataType = {
  name: string;
  description: string;
};

class TagsHttpService extends HttpService {
  async getTags() {
    return this.get<TagsType[]>('/tags');
  }

  async createTags(data: TagsDataType) {
    return this.post('/tags', { ...data });
  }
}

export const TagsHttpServiceInstance = new TagsHttpService();
