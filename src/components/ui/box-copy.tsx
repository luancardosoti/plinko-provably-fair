import * as React from "react"

import { cn } from "@/lib/utils"
import { Copy } from "lucide-react"
import { Button } from "./button"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export interface BoxCopyProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
    value: string;
    children?: React.ReactNode;
  }

export function BoxCopy({ className, value, children, ...rest }: BoxCopyProps) {
  const [isCopied, setIsCopied] = React.useState(false)

  function handleCopy() {
    setIsCopied(true)
    navigator.clipboard.writeText(value)
    setTimeout(() => {
      setIsCopied(false)
    }, 1500)
  }

  return (
    <div className={cn("h-12 px-4 rounded-md border border-input bg-primary-800 flex items-center justify-between gap-4 focus-within:border-primary-500", className)} {...rest}>
      {children ?? <span className="truncate max-w-80">{value}</span>}
  
      <TooltipProvider>
        <Tooltip open={isCopied}>
          <TooltipTrigger asChild>
            <Button
              onClick={handleCopy}
              className="p-0 text-muted-foreground hover:bg-transparent hover:text-white"
              variant="ghost"
              type="button"
            >
              <Copy className="size-6 mx-auto" /> 
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" sideOffset={0} >
            <p>Copied!</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
