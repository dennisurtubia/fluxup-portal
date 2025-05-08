import { CategoryType } from '@/features/categories/http/CategoryHttpService';
import { TagType } from '@/features/tag/http/TagHttpService';
import { HttpService } from '@/http/HttpService';

export type BudgetEntryBodyType = {
  description: string;
  amount: number;
  type: 'income' | 'expense';
  tags?: number[];
  month: number;
  category_id: number;
};

export type BudgetEntryType = {
  id: number;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  tags: TagType[];
  created_at: string;
  updated_at: string;
  month: number;
  category: CategoryType;
};

class BudgetEntryService extends HttpService {
  async getBudgetEntries(id: number, type: 'income' | 'expense') {
    return this.get<BudgetEntryType[]>(`/budgets/${id}/entries?type=${type}`);
  }

  async getEntriesByMonth(budgetId: number, month: number) {
    return this.get<BudgetEntryType[]>(`/budgets/${budgetId}/entries?month=${month}`);
  }

  async createBudgetEntry(id: number, data: BudgetEntryBodyType) {
    return this.post(`/budgets/${id}/entries`, data);
  }
}

export const budgetEntryHttpServiceInstance = new BudgetEntryService();
