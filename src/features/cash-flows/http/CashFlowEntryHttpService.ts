import { BankAccountType } from '@/features/bank-account/http/BankAcoountHttpService';
import { CategoryType } from '@/features/categories/http/CategoryHttpService';
import { PartyType } from '@/features/party/http/PartyHttpService';
import { TagType } from '@/features/tag/http/TagHttpService';
import { HttpService } from '@/http/HttpService';

export type CashFlowEntryBodyType = {
  description: string;
  amount: number;
  type: 'income' | 'expense';
  tags?: number[];
  transaction_date: string;
  category_id: number;
  bank_account_id: number;
  party_id: number;
  payment_type: 'boleto' | 'pix' | 'ted' | 'credit_card' | 'debit_card';
};

export type CashFlowEntryType = {
  id: number;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  payment_type: 'boleto' | 'pix' | 'ted' | 'credit_card' | 'debit_card';
  tags: TagType[];
  created_at: string;
  updated_at: string;
  transaction_date: string;
  category: CategoryType;
  bank_account: BankAccountType;
  party: PartyType;
};

class CashFlowEntryService extends HttpService {
  async getCashFlowEntries(id: number) {
    return this.get<CashFlowEntryType[]>(`/cash-flows/${id}/entries`);
  }

  async createCashFlowEntry(id: number, data: CashFlowEntryBodyType) {
    return this.post(`/cash-flows/${id}/entries`, data);
  }
}

export const cashFlowEntryHttpServiceInstance = new CashFlowEntryService();
