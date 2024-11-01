import * as React from "react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface SelectRiskProps {
  defaultValue?: string;
  value?: string;
}

export function SelectRisk({ defaultValue, value }: SelectRiskProps) {
  return (
    <Select defaultValue={defaultValue} value={value}>
      <SelectTrigger className="">
        <SelectValue placeholder="Select a risk" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="low">Low</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="high">High</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
