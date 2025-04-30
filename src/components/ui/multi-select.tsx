import * as React from "react"
import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"

type Option = {
  value: number
  label: string
}

interface MultiSelectProps {
  options: Option[]
  selected: number[]
  onChange: (selected: number[]) => void
  placeholder?: string
  className?: string
}

function MultiSelect({
  options = [],
  selected = [],
  onChange,
  placeholder = "Selecionar...",
  className,
}: MultiSelectProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [open, setOpen] = React.useState(false)

  const handleUnselect = (option: number) => {
    onChange(selected.filter((s) => s !== option))
  }

  const selectables = options.filter((option) => !selected.includes(option.value))

  return (
    <div className={`relative inline-block ${className}`}>
      <div className="border rounded-md px-3 py-2 text-sm w-full dark:bg-input/30">
        <div className="flex flex-wrap gap-1">
          {selected.map((selectedValue) => {
            const option = options.find((o) => o.value === selectedValue)
            return (
              <Badge
                key={selectedValue}
                variant="outline"
                className="rounded-sm px-1 font-normal"
              >
                {option?.label || selectedValue}
                <button
                  className="ml-1 rounded-sm outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onClick={() => handleUnselect(selectedValue)}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            )
          })}

          <input
            ref={inputRef}
            value=""
            readOnly
            onFocus={() => setOpen(true)}
            onBlur={() => {

              setTimeout(() => {
                setOpen(false)
              }, 200)
            }}
            placeholder={selected.length === 0 ? placeholder : undefined}
            className="flex-1 selection:bg-primary outline-none placeholder:text-muted-foreground min-w-[120px]"
          />
        </div>
      </div>

      {open && selectables.length > 0 && (
        <div
          className="
            absolute
            left-0
            z-10
            mt-1
            w-full
            rounded-md
            border
            bg-popover
            p-1
            text-popover-foreground
            shadow-md
            outline-none
            animate-in
            max-h-40 overflow-auto
          "
        >
          {selectables.map((option) => (
            <div
              key={option.value}
              onMouseDown={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onChange([...selected, option.value])
              }}
              className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
            >
              <Badge variant="outline">{option.label}</Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export {MultiSelect};