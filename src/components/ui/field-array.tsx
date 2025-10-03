import React from 'react';
import { Control, FieldValues, useFieldArray, ArrayPath } from 'react-hook-form';
import { Plus, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface FieldArrayProps<TFieldValues extends FieldValues = FieldValues> {
  control: Control<TFieldValues>;
  name: ArrayPath<TFieldValues>;
  children: (index: number, remove: (index: number) => void) => React.ReactNode;
  defaultValue?: Record<string, any>;
  addButtonText?: string;
  removeButtonText?: string;
  className?: string;
  minItems?: number;
  maxItems?: number;
  onAdd?: (index: number) => void;
  onRemove?: (index: number) => void;
  disabled?: boolean;
}

export function FieldArray<TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  children,
  defaultValue = {},
  addButtonText = 'Adicionar',
  removeButtonText = 'Remover',
  className,
  minItems = 1,
  maxItems,
  onAdd,
  onRemove,
  disabled = false,
}: FieldArrayProps<TFieldValues>) {
  const {
    fields: fieldArray,
    append,
    remove,
  } = useFieldArray({
    control,
    name,
  });

  const handleAdd = () => {
    if (maxItems && fieldArray.length >= maxItems) return;

    append(defaultValue as any);
    onAdd?.(fieldArray.length);
  };

  const handleRemove = (index: number) => {
    if (fieldArray.length <= minItems) return;

    remove(index);
    onRemove?.(index);
  };

  const canAdd = !maxItems || fieldArray.length < maxItems;
  const canRemove = fieldArray.length > minItems;

  return (
    <div className={cn('space-y-4', className)}>
      {fieldArray.map((item, index) => (
        <div
          key={item.id}
          className="relative p-4 border border-border rounded-lg bg-card space-y-4"
        >
          {canRemove && !disabled && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
              onClick={() => handleRemove(index)}
              aria-label={removeButtonText}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pr-10 w-full items-start">
            {children(index, handleRemove)}
          </div>
        </div>
      ))}
      {canAdd && !disabled && (
        <Button
          type="button"
          variant="outline"
          onClick={handleAdd}
          className="w-full border-dashed border-2 hover:border-primary/50"
        >
          <Plus className="h-4 w-4 mr-2" />
          {addButtonText}
        </Button>
      )}
      {(minItems > 1 || maxItems) && (
        <p className="text-sm text-muted-foreground">
          {minItems > 1 && `Mínimo: ${minItems} ${minItems === 1 ? 'item' : 'itens'}`}
          {minItems > 1 && maxItems && ' • '}
          {maxItems && `Máximo: ${maxItems} ${maxItems === 1 ? 'item' : 'itens'}`}
        </p>
      )}
    </div>
  );
}

export default FieldArray;
