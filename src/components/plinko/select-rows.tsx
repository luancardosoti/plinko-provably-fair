import * as React from "react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export const rowsOptions = ['16'] as const
// TODO: add 8, 9, 10, 11, 12, 13, 14, 15

interface SelectRowsProps {
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
}

export function SelectRows({ defaultValue, value, onChange, disabled }: SelectRowsProps) {
  return (
    <Select defaultValue={defaultValue} value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger>
        <SelectValue placeholder="Select a rows" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {rowsOptions.map((option) => (
            <SelectItem key={option} value={option}>{option}</SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
