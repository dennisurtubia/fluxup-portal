import { TagType } from '@/features/tag/http/TagHttpService';
import { HttpService } from '@/http/HttpService';

export type BudgetEntryBodyType = {
  description: string;
  amount_micro: number;
  type: 'income' | 'expense';
  tags: number[];
};

export type BudgetEntryType = {
  id: number;
  description: string;
  amount_micro: number;
  type: 'income' | 'expense';
  tags: TagType[];
  created_at: string;
  updated_at: string;
};

class BudgetEntryService extends HttpService {
  async getBudgetEntries(id: number, type: 'income' | 'expense') {
    return this.get<BudgetEntryType[]>(`/budgets/${id}/entries?type=${type}`);
  }

  async createBudgetEntry(id: number, data: BudgetEntryBodyType) {
    return this.post(`/budgets/${id}/entries`, data);
  }
}

export const budgetEntryHttpServiceInstance = new BudgetEntryService();
