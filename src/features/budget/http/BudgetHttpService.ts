import { HttpService } from '@/http/HttpService';

export type BudgetType = {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
};

type BudgetDataType = {
  name: string;
  description: string;
  start_date: string;
  end_date: string;
};

class BudgetHttpService extends HttpService {
  async getBudgets() {
    return this.get<BudgetType[]>('/budgets');
  }

  async createBudget(data: BudgetDataType) {
    return this.post('/budgets', data);
  }

  async updateBudget(id: number, data: BudgetDataType) {
    return this.put(`/budgets/${id}`, data);
  }

  async deleteBudget(id: number) {
    return this.delete(`/budgets/${id}`);
  }
}

export const budgetHttpServiceInstance = new BudgetHttpService();
