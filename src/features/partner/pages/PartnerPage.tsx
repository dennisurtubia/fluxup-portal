import { useCallback, useRef } from 'react';

import PartnerCreateDialog, { PartnerCreateDialogRef } from '../components/PartnerCreateDialog';

import { Button } from '@/components/ui/button';
import Title from '@/components/ui/title';

export default function PartnerPage() {
  const dialogRef = useRef<PartnerCreateDialogRef>(null);

  const handleCreatePartner = useCallback(() => {
    dialogRef.current?.open();
  }, []);
  return (
    <div className="h-full w-full">
      <div className="flex justify-between items-center mb-5">
        <Title>Parceiros</Title>
        <Button variant="default" onClick={handleCreatePartner}>
          Novo Parceiro
        </Button>
        <PartnerCreateDialog ref={dialogRef} />
      </div>
    </div>
  );
}
