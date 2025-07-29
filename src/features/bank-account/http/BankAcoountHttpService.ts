import { HttpService } from '@/http/HttpService';

export type BankAccountType = {
  id: number;
  name: string;
  number: string;
  branch_code: string;
  created_at: Date;
  updated_at: Date;
  bank: 'BANCO_DO_BRASIL' | 'CRESOL';
  current_balance: number;
};

export type BankAccountDataType = {
  name: string;
  number: string;
  branch_code: string;
  bank: 'BANCO_DO_BRASIL' | 'CRESOL';
};

class BankAccountHttpService extends HttpService {
  async getBankAccounts() {
    return this.get<BankAccountType[]>('/bank-accounts');
  }

  async createBankAccount(data: BankAccountDataType) {
    return this.post('/bank-accounts', data);
  }
}

export const bankAccountHttpServiceInstance = new BankAccountHttpService();
