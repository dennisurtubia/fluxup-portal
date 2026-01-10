import { Check, ChevronsUpDown } from 'lucide-react';
import * as React from 'react';

import type { PartyType } from '../../http/PartyHttpService';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

type PartyComboboxProps = {
  value: string;
  onChange: (_value: string) => void;
  parties?: PartyType[];
  isLoading?: boolean;
  search: string;
  onSearchChange: (_value: string) => void;
  selectedParty: PartyType | null;
  onSelectedPartyChange: (_party: PartyType | null) => void;
  placeholder?: string;
  searchPlaceholder?: string;
};

export function PartyCombobox({
  value,
  onChange,
  parties,
  isLoading = false,
  search,
  onSearchChange,
  selectedParty,
  onSelectedPartyChange,
  placeholder = 'Selecione o parceiro',
  searchPlaceholder = 'Buscar parceiro...',
}: PartyComboboxProps) {
  const [open, setOpen] = React.useState(false);

  const selectedFromList = parties?.find((party) => party.id.toString() === value);
  const currentLabel = selectedParty?.name || selectedFromList?.name || placeholder;

  return (
    <Popover
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) {
          onSearchChange('');
        }
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {currentLabel}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command>
          <CommandInput
            placeholder={searchPlaceholder}
            value={search}
            onValueChange={onSearchChange}
            className="h-9"
          />
          <CommandList>
            {isLoading ? (
              <div className="px-2 py-1.5 text-sm text-muted-foreground">
                Carregando parceiros...
              </div>
            ) : null}
            {!isLoading && parties?.length === 0 ? (
              <CommandEmpty>Nenhum parceiro encontrado.</CommandEmpty>
            ) : null}
            <CommandGroup>
              {parties?.map((party) => {
                const partyValue = party.id.toString();
                const isSelected = value === partyValue;

                return (
                  <CommandItem
                    key={party.id}
                    value={party.name}
                    onSelect={() => {
                      if (isSelected) {
                        onChange('');
                        onSelectedPartyChange(null);
                      } else {
                        onChange(partyValue);
                        onSelectedPartyChange(party);
                      }
                      setOpen(false);
                      onSearchChange('');
                    }}
                  >
                    {party.name}
                    <Check className={cn('ml-auto', isSelected ? 'opacity-100' : 'opacity-0')} />
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
