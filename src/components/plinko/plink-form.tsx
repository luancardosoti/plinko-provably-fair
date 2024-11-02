'use client'

import { DollarSign } from "lucide-react";
import { riskOptions, SelectRisk } from "./select-risk";
import { rowsOptions, SelectRows } from "./select-rows";
import { usePlinkoStore } from '../../stores/plinko-store'
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useProvablyFairStore } from "@/stores/provably-fair-store";
import { Input } from "@/components/ui/input";
import { generateFloats } from "@/utils/provably-fair";
import { useHistoryStore } from "@/stores/use-history-store";
import { useUserStore } from "@/stores/user-store";

const formSchema = z.object({
  betAmount: z.coerce.number().min(1).default(1),
  risk: z.enum(riskOptions).default('low'),
  rows: z.enum(rowsOptions).default('16'),
})

type FormSchema = z.infer<typeof formSchema>

export function PlinkForm() {
  const { control, register, handleSubmit, watch } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      betAmount: 1,
      risk: 'low',
      rows: '16',
    }
  })

  const { setRows } = usePlinkoStore()

  const onSubmit = (data: FormSchema) => {
    newBetPlinko(data)
  }

  const { serverSeed, serverSeedHash, clientSeed, nonce, incrementNonce } = useProvablyFairStore()
  const { addNewBall } = usePlinkoStore()
  const { addGameResult } = useHistoryStore()
  const { username } = useUserStore()

  function newBetPlinko(data: FormSchema) {
    const floats = generateFloats({
      serverSeed,
      clientSeed,
      nonce,
      cursor: 0,
      count: Number(rows)
    });
    
    const multipliers = [16, 9, 2, 1.4, 1.4, 1.2, 1.1, 1, 0.5, 1, 1.1, 1.2, 1.4, 1.4, 2, 9, 16]
    const PATHS = [ "left", "right" ] as const;
    const indicesPagamento = floats.map(float => Math.floor(float * 2)) ;
    const multiplier = multipliers[indicesPagamento.reduce((acc, curr) => acc + curr, 0)]
    const directions = indicesPagamento.map(index => PATHS[index]) ;

    const betAmount = data.betAmount;

    incrementNonce()

    addNewBall({
      id: new Date().getTime().toString(),
      directions,
      drawn: false,
      callback: () => {
        addGameResult({
          username,
          betAmount: String(betAmount),
          multiplier: String(multiplier),
          payout: String(betAmount * multiplier),

          serverSeed,
          serverSeedHash,
          clientSeed,
          nonce,
        })
      }
    })
  }

  const rows = watch('rows')

  useEffect(() => {
    setRows(rows)
  }, [rows])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4 text-sm font-extrabold space-y-4 border-r">
      <div className="space-y-2">
        <label htmlFor="betAmount">BET AMOUNT</label> 
        <div className="rounded-sm h-12 flex items-center bg-primary-800 border focus-within:border-primary-500">
          <div className="bg-green-400 p-1 mx-3 rounded-full">
            <DollarSign className="size-3 text-background"/>
          </div>
          <span className="w-px h-5 bg-zinc-400" /> 
          <Input
            id="betAmount"
            className="bg-transparent border-none outline-none mx-3 font-light"
            type="number"
            {...register('betAmount')}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="">RISK</label> 
        <Controller
          control={control}
          name="risk"
          render={({ field }) => (
            <SelectRisk {...field} defaultValue={field.value} />
          )}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="">ROWS</label> 
        <Controller
          control={control}
          name="rows"
          render={({ field }) => (
            <SelectRows {...field} defaultValue={field.value} />
          )}
        />
      </div>

      <button 
        type="submit" 
        className="w-full h-12 bg-primary-500 text-white p-2 rounded-sm transition-all hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        BET
      </button>
    </form>
  )
}