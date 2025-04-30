import { HttpService } from '@/http/HttpService';

export type CashFlowBodyType = {
  description?: string;
  start_date: Date;
  end_date: Date;
  name: string;
};

export type CashFlowType = {
  id: number;
  created_at: string;
  updated_at: string;
  description: string;
  start_date: string;
  end_date: string;
  name: string;
};

class CashFlowService extends HttpService {
  async getCashFlowEntries() {
    return this.get<CashFlowType[]>('/cash-flows');
  }

  async createCashFlow(data: CashFlowBodyType) {
    const start_date = data.start_date.toISOString().split('T')[0];
    const end_date = data.end_date.toISOString().split('T')[0];

    return this.post('/cash-flows', {
      ...data,
      start_date,
      end_date,
    });
  }
}

export const cashFlowsHttpServiceInstance = new CashFlowService();
