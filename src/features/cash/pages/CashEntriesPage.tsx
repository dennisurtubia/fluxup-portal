import { useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

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

  const dialogRef = useRef<CashEntryCreateDialogRef>(null);

  const handleCreateCashEntry = useCallback(() => {
    dialogRef.current?.setCashId(Number(id));
    dialogRef.current?.open();
  }, [id]);

  return (
    <div className="h-full w-full">
      <div className="flex justify-between items-center mb-5">
        <HeaderNavigation title={name} />
        <Button variant="default" onClick={handleCreateCashEntry}>
          Nova Entrada
        </Button>

        <CashEntryCreateDialog ref={dialogRef} />
      </div>

      <CashEntryTable cashId={Number(id)} />
    </div>
  );
}
