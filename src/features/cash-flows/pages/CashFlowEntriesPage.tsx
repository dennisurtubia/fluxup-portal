import { useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import CashFlowEntryCreateDialog, {
  CashFlowEntryCreateDialogRef,
} from '../components/CashFlowEntryCreateDialog';
import { CashFlowEntryTable } from '../components/CashFlowEntryTable';

import { Button } from '@/components/ui/button';
import Title from '@/components/ui/title';

export default function CashFlowEntriesPage() {
  const params = useParams();

  const { id } = params;

  const location = useLocation();
  const { name } = location.state || {};

  const dialogRef = useRef<CashFlowEntryCreateDialogRef>(null);

  const handleCreateCashFlowEntry = useCallback(() => {
    dialogRef.current?.setCashFlowId(Number(id));
    dialogRef.current?.open();
  }, [id]);

  return (
    <div className="h-full w-full">
      <div className="flex justify-between items-center mb-5">
        <Title>{name}</Title>
        <Button variant="default" onClick={handleCreateCashFlowEntry}>
          Nova Entrada
        </Button>

        <CashFlowEntryCreateDialog ref={dialogRef} />
      </div>

      <CashFlowEntryTable cashFlowId={Number(id)} />
    </div>
  );
}
