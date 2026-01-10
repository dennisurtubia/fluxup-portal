import { HttpService } from '@/http/HttpService';

export type PartyType = {
  id: number;
  name: string;
  document: string;
  phone_number: string;
  email: string;
  created_at: string;
  updated_at: string;
  types: Array<
    'supplier' | 'seat_holder' | 'sponsor' | 'directorship' | 'collaborator' | 'customer'
  >;
};

export type PartyDataType = {
  name: string;
  document: string;
  phone_number: string;
  email: string;
  type: 'supplier' | 'seat_holder' | 'sponsor' | 'directorship' | 'collaborator' | 'customer';
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    country: string;
    zip_code: string;
  };
};

export type GetPartiesParams = {
  name?: string;
  limit?: number;
  offset?: number;
};

class PartyService extends HttpService {
  async getParties(params?: GetPartiesParams) {
    return this.get<PartyType[]>('/parties', { params });
  }

  async createParty(data: PartyDataType) {
    return this.post('/parties', data);
  }
}

export const partiesHttpServiceInstance = new PartyService();
