import { useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import CashClosingDialog, { CashClosingDialogRef } from '../components/CashClosingDialog';
import CashEntryCreateDialog, {
  CashEntryCreateDialogRef,
} from '../components/CashEntryCreateDialog';
import { CashEntryTable } from '../components/CashEntryTable';

import HeaderNavigation from '@/components/HeaderNavigation';
import { Button } from '@/components/ui/button';

export default function CashEntriesPage() {
  const params = useParams();

  const { id } = params;

  const location = useLocation();
  const { name } = location.state || {};

  const dialogCreateRef = useRef<CashEntryCreateDialogRef>(null);
  const dialogClosingRef = useRef<CashClosingDialogRef>(null);

  const handleCreateCashEntry = useCallback(() => {
    dialogCreateRef.current?.setCashId(Number(id));
    dialogCreateRef.current?.open();
  }, [id]);

  const handleClosingCash = useCallback(() => {
    dialogClosingRef.current?.setCashId(Number(id));
    dialogClosingRef.current?.SetNameCash(name);
    dialogClosingRef.current?.open();
  }, [id, name]);

  return (
    <div className="h-full w-full">
      <div className="flex justify-between items-center mb-5">
        <HeaderNavigation title={name} />
        <div className="flex gap-2">
          <Button variant="default" onClick={handleCreateCashEntry}>
            Nova Entrada
          </Button>

          <Button variant="default" onClick={handleClosingCash}>
            Fechar caixa
          </Button>
        </div>

        <CashEntryCreateDialog ref={dialogCreateRef} />
        <CashClosingDialog ref={dialogClosingRef} />
      </div>

      <CashEntryTable cashId={Number(id)} />
    </div>
  );
}
