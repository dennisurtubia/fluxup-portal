import { HttpService } from '@/http/HttpService';

export type StateType = {
  id: number;
  sigla: string;
  nome: string;
  regiao: {
    id: number;
    sigla: string;
    nome: string;
  };
};

export type MunicipalityType = {
  nome: string;
  codigo_ibge: number;
};

class StateMunicipalityService extends HttpService {
  async getStates() {
    return this.get<StateType[]>('https://brasilapi.com.br/api/ibge/uf/v1');
  }

  async getMunicipalities(uf: string) {
    return this.get<MunicipalityType[]>(
      `https://brasilapi.com.br/api/ibge/municipios/v1/${uf}?providers=dados-abertos-br,gov`,
    );
  }
}

export const stateMunicipalityHttpServiceInstance = new StateMunicipalityService();
