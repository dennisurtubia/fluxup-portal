import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const months = [
  { value: "01", label: "Janeiro" },
  { value: "02", label: "Fevereiro" },
  { value: "03", label: "Março" },
  { value: "04", label: "Abril" },
  { value: "05", label: "Maio" },
  { value: "06", label: "Junho" },
  { value: "07", label: "Julho" },
  { value: "08", label: "Agosto" },
  { value: "09", label: "Setembro" },
  { value: "10", label: "Outubro" },
  { value: "11", label: "Novembro" },
  { value: "12", label: "Dezembro" },
];

type MonthSelectProps = {
  value: string;
  onChange: (value: string) => void;
  range?: {
    start: string;
    end: string;
  };
};

export function MonthSelect({ value, onChange, range }: MonthSelectProps) {
  const startMonth = range?.start ? Number(range.start) : 1;
  const endMonth = range?.end ? Number(range.end) : 12;

  const filteredMonths = months.filter((month) => {
    const monthNumber = Number(month.value);
    return monthNumber >= startMonth && monthNumber <= endMonth;
  }
  );
  const monthsToDisplay = range ? filteredMonths : months;

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Selecione um mês" />
      </SelectTrigger>
      <SelectContent className='max-h-60 overflow-auto'>
        {monthsToDisplay.map((month) => (
          <SelectItem key={month.value} value={month.value}>
            {month.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
