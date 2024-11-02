'use client'

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { type GameHistory } from "@/stores/use-history-store"
import { CircleDollarSign } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { BoxCopy } from "@/components/ui/box-copy"

interface BetPlinkoModalProps {
  game: GameHistory
}

const formatTime = (timestamp: string) => {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).format(new Date(timestamp))
};

export function BetPlinkoModal({ game }: BetPlinkoModalProps) {
  const [isCopied, setIsCopied] = useState(false)

  const {
    id,
    username,
    timestamp,
    multiplier,
    betAmount,
    payout,
    serverSeed,
    serverSeedHash,
    clientSeed,
    nonce,
  } = game

  function handleCopy() {
    setIsCopied(true)
    navigator.clipboard.writeText(id)
    setTimeout(() => {
      setIsCopied(false)
    }, 1500)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className="px-0 text-muted-foreground font-extrabold capitalize text-sm hover:no-underline tracking-tight hover:text-primary-500" size="sm">
          Plinko
        </Button>
      </DialogTrigger>


      <DialogContent className="sm:max-w-lg p-12">
        <DialogHeader>
          <DialogTitle />
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex flex-col items-center justify-center bg-primary-900 border rounded-md p-3 gap-1">
            <span className="text-xs text-foreground font-extrabold tracking-tight">PAYOUT</span>
            <div className="flex items-center justify-center gap-1">
              <CircleDollarSign className="size-6 text-green-600" />
              <span className="text-xl text-foreground font-extrabold tracking-tight">{payout}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center justify-center bg-primary-800 rounded-md gap-1 p-3">
              <span className="text-xs text-foreground font-bold tracking-tight">BET</span>
              <div className="flex items-center justify-center gap-1">
                <CircleDollarSign className="size-6 text-green-600" />
                <span className="text-sm text-foreground font-extrabold tracking-tight">{betAmount}</span>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center bg-primary-900 border rounded-md gap-1 p-3">
              <span className="text-xs text-muted-foreground font-bold tracking-tight">MULTIPLYER</span>
              <span className="text-sm text-green-500 font-extrabold tracking-tight">{multiplier}X</span>
            </div>
          </div>
        </div>

        <Separator className="border-dashed my-4"/>

        <div className="space-y-2">
          <div className="flex items-center justify-between bg-primary-800 rounded-md p-3 gap-1">
            <span className="text-xs text-foreground font-extrabold tracking-tight">{username}</span>

            <div>
              <span className="text-xs text-muted-foreground">
                {formatTime(timestamp)}
              </span>
              <TooltipProvider>
                <Tooltip open={isCopied}>
                  <TooltipTrigger asChild>
                  <Button type="submit" onClick={handleCopy} variant="link" className="text-primary-500 font-extrabold capitalize text-xs hover:no-underline tracking-tight" size="sm">
                    BET ID
                  </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" sideOffset={0} >
                    <p>Copied!</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
            </div>
          </div>
        </div>
        
        <Accordion type="single"collapsible className="space-y-4">
          <AccordionItem value="provably-fair">
            <AccordionTrigger>PROVABLY FAIR</AccordionTrigger>
            <AccordionContent className="mt-6 px-1 space-y-4">
              <div className="space-y-2">
                <label className="capitalize text-sm text-foreground font-extrabold tracking-tight">
                  Server Seed
                </label> 
                <BoxCopy value={serverSeed} />
              </div>

              <div className="space-y-2">
                <label className="capitalize text-sm text-foreground font-extrabold tracking-tight">
                  Server Seed (Hashed)
                </label> 
                <BoxCopy value={serverSeedHash} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="capitalize text-sm text-foreground font-extrabold tracking-tight">
                    Client Seed
                  </label> 
                  <BoxCopy value={clientSeed} />
                </div>
                <div className="space-y-2">
                  <label className="capitalize text-sm text-foreground font-extrabold tracking-tight">
                    Nonces
                  </label>
                  <BoxCopy value={nonce.toString()} />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </DialogContent>
    </Dialog>
  )
}
