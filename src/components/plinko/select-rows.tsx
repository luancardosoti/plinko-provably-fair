import * as React from "react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface SelectRowsProps {
  defaultValue?: string;
  value?: string;
}

export function SelectRows({ defaultValue, value }: SelectRowsProps) {
  return (
    <Select defaultValue={defaultValue} value={value}>
      <SelectTrigger className="">
        <SelectValue placeholder="Select a rows" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="8">8</SelectItem>
          <SelectItem value="9">9</SelectItem>
          <SelectItem value="10">10</SelectItem>
          <SelectItem value="11">11</SelectItem>
          <SelectItem value="12">12</SelectItem>
          <SelectItem value="13">13</SelectItem>
          <SelectItem value="14">14</SelectItem>
          <SelectItem value="15">15</SelectItem>
          <SelectItem value="16">16</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
