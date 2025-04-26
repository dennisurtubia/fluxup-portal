import { HttpService } from '@/http/HttpService';

export type CategoryType = {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
};

export type CategoryDataType = {
  name: string;
  description?: string;
};

class CategoryHttpService extends HttpService {
  async getCategories() {
    return this.get<CategoryType[]>('/categories');
  }

  async createCategory(data: CategoryDataType) {
    return this.post('/categories', { ...data });
  }
}

export const CategoryHttpServiceInstance = new CategoryHttpService();
