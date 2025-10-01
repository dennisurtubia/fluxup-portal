import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AlertTriangle } from 'lucide-react';
import { forwardRef, useCallback, useImperativeHandle, useState } from 'react';
import { toast } from 'react-toastify';

import { cashHttpServiceInstance } from '../../http/CashHttpService';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { autoDownloadFromUrl } from '@/utils/pdfDownload';

export type CashClosingDialogRef = {
  open: () => void;
  close: () => void;
  setCashId: (_: number) => void;
  SetNameCash: (_: string) => void;
};

const CashClosingDialog = forwardRef<CashClosingDialogRef>((_, ref) => {
  const [open, setOpen] = useState(false);
  const [cashId, setCashId] = useState<number | null>(null);
  const [cashName, setCashName] = useState<string | null>(null);
  const queryClient = useQueryClient();

  useImperativeHandle(ref, () => ({
    open: () => setOpen(true),
    close: () => setOpen(false),
    setCashId: (newCashId: number) => setCashId(newCashId),
    SetNameCash: (name: string) => setCashName(name),
  }));

  const cashClosingMutation = useMutation({
    mutationFn: async (id: number) => {
      if (id == null) return Promise.resolve(null);

      return cashHttpServiceInstance.closingCash(id);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['cash-entry', 1] });
      setCashId(null);
      setOpen(false);

      toast.success('Caixa fechado com sucesso!');
      if (data?.url) autoDownloadFromUrl(data.url, 'fechamento-caixa.pdf');
    },
    onError: () => {
      toast.error('Erro ao fechar o caixa.');
    },
  });

  const onSubmit = useCallback(
    (id: number | null) => {
      if (id == null) {
        toast.error('ID do caixa não informado.');
        return;
      }
      cashClosingMutation.mutate(id);
    },
    [cashClosingMutation],
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Fechar caixa{cashName ? `: ${cashName}` : ''}?
          </DialogTitle>
        </DialogHeader>
        <div>
          <div className="flex items-center p-2 justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
          </div>
          <div className="text-center">
            <DialogDescription className="font-bold mb-2">
              Esta ação é irreversível.
            </DialogDescription>
            <DialogDescription>
              Ao fechar o caixa, você não poderá mais realizar movimentações neste dia.
            </DialogDescription>
          </div>
        </div>

        <DialogFooter className="p-1">
          <Button variant="default" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              if (cashId != null) {
                onSubmit(cashId);
              }
            }}
          >
            Fechar caixa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

export default CashClosingDialog;
