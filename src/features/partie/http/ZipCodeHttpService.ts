import { HttpService } from '@/http/HttpService';

export type ZipCodeType = {
  cep: string;
  state: string;
  city: string;
  neighborhood?: string;
  street: string;
};

class ZipCodeService extends HttpService {
  async getZipCodeData(cep: string) {
    return this.get<ZipCodeType>(`https://brasilapi.com.br/api/cep/v1/${cep}`);
  }
}

export const zipCodeHttpServiceInstance = new ZipCodeService();
