import { BankAccountType } from '@/features/bank-account/http/BankAcoountHttpService';
import { CategoryType } from '@/features/categories/http/CategoryHttpService';
import { PartyType } from '@/features/party/http/PartyHttpService';
import { TagType } from '@/features/tag/http/TagHttpService';
import { HttpService } from '@/http/HttpService';

export type CashEntryBodyType = {
  description: string;
  amount: number;
  type: 'income' | 'expense';
  tags?: number[];
  transaction_date: string;
  category_id: number;
  bank_account_id: number;
  party_id: number;
  payment_type: PaymentType;
};

export type CashEntryType = {
  id: number;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  payment_type: PaymentType;
  tags: TagType[];
  created_at: string;
  updated_at: string;
  transaction_date: string;
  category: CategoryType;
  bank_account: BankAccountType;
  party: PartyType;
};

export type PaymentType = 'boleto' | 'pix' | 'ted' | 'credit_card' | 'debit_card' | 'direct_debit';

class CashEntryService extends HttpService {
  async getCashEntries(id: number) {
    return this.get<CashEntryType[]>(`/cash-flows/${id}/entries`);
  }

  async createCashEntry(id: number, data: CashEntryBodyType) {
    return this.post(`/cash-flows/${id}/entries`, data);
  }
}

export const cashEntryHttpServiceInstance = new CashEntryService();
