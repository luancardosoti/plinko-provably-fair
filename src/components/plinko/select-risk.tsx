import * as React from "react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export const riskOptions = ['low'] as const // TODO: add medium and high

interface SelectRiskProps {
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
}

export function SelectRisk({ defaultValue, value, onChange, disabled }: SelectRiskProps) {
  return (
    <Select defaultValue={defaultValue} value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className="capitalize">
        <SelectValue placeholder="Select a risk" />
      </SelectTrigger>
      <SelectContent position="item-aligned" >
        <SelectGroup >
          {riskOptions.map((option) => (
            <SelectItem key={option} value={option} className="capitalize">{option}</SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
