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

export type BudgetDataType = {
  name: string;
  description?: string;
  start_date: Date;
  end_date: Date;
};

class BudgetHttpService extends HttpService {
  async getBudgets() {
    return this.get<BudgetType[]>('/budgets');
  }

  async createBudget(data: BudgetDataType) {
    const start_date = data.start_date.toISOString().split('T')[0];
    const end_date = data.end_date.toISOString().split('T')[0];

    return this.post('/budgets', { ...data, start_date, end_date });
  }

  async updateBudget(id: number, data: BudgetDataType) {
    return this.put(`/budgets/${id}`, data);
  }

  async deleteBudget(id: number) {
    return this.delete(`/budgets/${id}`);
  }
}

export const budgetHttpServiceInstance = new BudgetHttpService();
