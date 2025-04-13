import { HttpService } from '@/http/HttpService';

export type CepType = {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
};

class CepService extends HttpService {
  async getCepData(cep: string) {
    return this.get<CepType>(`https://viacep.com.br/ws/${cep}/json/`);
  }
}

export const cepHttpServiceInstance = new CepService();
