import { HttpService } from '@/http/HttpService';

export type CashBodyType = {
  description?: string;
  start_date: Date;
  end_date: Date;
  name: string;
};

export type CashType = {
  id: number;
  created_at: string;
  updated_at: string;
  description: string;
  start_date: string;
  end_date: string;
  name: string;
};

class CashService extends HttpService {
  async getCashEntries() {
    return this.get<CashType[]>('/cash-flows');
  }

  async createCash(data: CashBodyType) {
    const start_date = data.start_date.toISOString().split('T')[0];
    const end_date = data.end_date.toISOString().split('T')[0];

    return this.post('/cash-flows', {
      ...data,
      start_date,
      end_date,
    });
  }
}

export const cashHttpServiceInstance = new CashService();
