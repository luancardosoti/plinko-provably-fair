'use client'

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Scale, X } from "lucide-react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { generateRotateServerSeed, useProvablyFairStore, type RotateServerSeed } from "@/stores/provably-fair-store"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { BoxCopy } from "@/components/ui/box-copy"
import { useHistoryStore } from "@/stores/use-history-store"
import { FormVerifyBet } from "./form-verify-bet"

export function FairnessModal() {
  const { serverSeedHash, clientSeed } = useProvablyFairStore()
  const { history } = useHistoryStore()

  const lengthBetsByServerSeedHash = history.filter(bet => bet.serverSeedHash === serverSeedHash).length.toString()

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className="text-primary-500 font-extrabold uppercase text-sm hover:no-underline">
          FAIRNESS
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader className="flex flex-row items-center gap-2 space-y-0">
          <Scale className="size-5 text-primary-500" />
          <DialogTitle className="font-extrabold text-lg">FAIRNESS</DialogTitle>
          <DialogClose asChild>
            <Button className="ml-2" variant="outline" size="icon">
              <X />
            </Button>
          </DialogClose>
        </DialogHeader>
        
        <Accordion type="single" defaultValue="seeds" collapsible className="space-y-4 mt-4">
          <AccordionItem value="seeds">
            <AccordionTrigger>SEEDS</AccordionTrigger>
            <AccordionContent className="mt-6 space-y-4">
              <div className="space-y-2">
                <label htmlFor="active-server-seed" className="capitalize text-sm text-foreground font-extrabold tracking-tight">
                  Active Server Seed (Hashed)
                </label> 
                <BoxCopy id="active-server-seed" value={serverSeedHash} />
              </div>

              <div className="grid grid-cols-5 gap-3">
                <div className="col-span-3">
                  <div className="space-y-2 w-full">
                    <label htmlFor="active-server-seed" className="capitalize text-sm text-foreground font-extrabold tracking-tight">
                    Active Client Seed
                    </label> 
                    <BoxCopy id="active-server-seed" value={clientSeed} />
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="space-y-2">
                    <label htmlFor="active-server-seed" className="capitalize text-sm text-foreground font-extrabold tracking-tight">
                      Total bets made with pair
                    </label>
                    <BoxCopy id="active-server-seed" value={lengthBetsByServerSeedHash} />
                  </div>
                </div>
              </div>

              <FormRotateServerSeed />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="verify">
            <AccordionTrigger>VERIFY</AccordionTrigger>
            <AccordionContent className="px-1 mt-6 space-y-4">
              <FormVerifyBet />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </DialogContent>
    </Dialog>
  )
}

function FormRotateServerSeed() {
  const [rotateData, setRotateData] = useState<RotateServerSeed>(generateRotateServerSeed())

  const { rotateServerSeed } = useProvablyFairStore()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    rotateServerSeed({
      newClientSeed: rotateData.newClientSeed,
      newServerSeed: rotateData.newServerSeed,
      newServerSeedHash: rotateData.newServerSeedHash
    })
    setRotateData(generateRotateServerSeed())
  }

  return (
    <form onSubmit={handleSubmit} className="bg-primary-800 p-8 rounded-md space-y-4">
      <h2 className="text-md font-extrabold text-foreground text-center mb-6">ROTATE SERVER SEED</h2>
      <div className="flex items-end gap-4">
        <div className="space-y-2 w-full">
          <label htmlFor="new-client-seed" className="capitalize text-sm text-foreground font-extrabold tracking-tight">
          New Client Seed <span className="text-xs text-red-500">*</span>
          </label> 
          <Input
            id="new-client-seed"
            className="bg-primary-900"
            value={rotateData.newClientSeed}
            onChange={(e) => setRotateData({...rotateData, newClientSeed: e.target.value})}
          />
        </div>
        <Button className="px-8" type="submit">Change</Button>
      </div>
      <div className="space-y-2">
        <label htmlFor="new-server-seed" className="capitalize text-sm text-foreground font-extrabold tracking-tight">
        New Server Seed (Hashed)
        </label> 
        <BoxCopy id="new-server-seed" className="bg-primary-900" value={rotateData.newServerSeedHash} />
      </div>
    </form>
  )
}

