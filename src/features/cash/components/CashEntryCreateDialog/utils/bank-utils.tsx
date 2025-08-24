import { JSX } from 'react';

import BancoDoBrasilLogo from '@/assets/bb-logo.svg';
import CresolLogo from '@/assets/cresol-logo.svg';

export type BankCode = 'BANCO_DO_BRASIL' | 'CRESOL';

const bankLogos: Record<BankCode, string> = {
  BANCO_DO_BRASIL: BancoDoBrasilLogo,
  CRESOL: CresolLogo,
};

const bankLabels: Record<BankCode, string> = {
  BANCO_DO_BRASIL: 'Banco do Brasil',
  CRESOL: 'Cresol',
};

export function getBankDisplayData(bankCode: string): {
  logo: JSX.Element | null;
  label: string;
} {
  const logoPath = bankLogos[bankCode as BankCode];
  const label = bankLabels[bankCode as BankCode];

  return {
    logo: logoPath ? <img src={logoPath} alt={bankCode} className="w-6 h-6" /> : null,
    label,
  };
}
