import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"
import { riskOptions, SelectRisk } from "./plinko/select-risk"
import { rowsOptions, SelectRows } from "./plinko/select-rows"
import { Input } from "./ui/input"
import { CircleHelp } from "lucide-react"
import { GAME_CONSTANTS } from "./plinko/plinko-board"
import { useMemo } from "react"
import { generateFloats } from "@/utils/provably-fair"

const formSchema = z.object({
  clientSeed: z.string().min(1),
  serverSeed: z.string().min(1),
  nonce: z.string().min(1),
  risk: z.enum(riskOptions),
  rows: z.enum(rowsOptions),
})

type FormSchema = z.infer<typeof formSchema>

export function FormVerifyBet() {
  const { handleSubmit, register, control, watch } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      risk: 'low',
      rows: '16',
    },
  })

  function onSubmit() {}

  const { serverSeed, clientSeed, nonce } = watch()

  const multiplier = useMemo(() => {
    if (serverSeed && clientSeed && nonce)  {
      const floats = generateFloats({
        serverSeed,
        clientSeed,
        nonce: Number(nonce),
        cursor: 0,
        count: 16
      });

      const multipliers = [16, 9, 2, 1.4, 1.4, 1.2, 1.1, 1, 0.5, 1, 1.1, 1.2, 1.4, 1.4, 2, 9, 16]
      const indicesPagamento = floats.map(float => Math.floor(float * 2)) ;
      const multiplier = multipliers[indicesPagamento.reduce((acc, curr) => acc + curr, 0)]

      return `${multiplier}x`
    }

    return null
  }, [
    serverSeed,
    clientSeed,
    nonce
  ])

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2 w-full">
          <label htmlFor="client-seed" className="capitalize text-sm text-foreground font-extrabold tracking-tight">
            Client Seed
          </label> 
          <Input
            id="client-seed"
            className="bg-primary-800"
            {...register('clientSeed')}
          />
        </div>

        <div className="grid grid-cols-5 gap-4">
          <div className="col-span-3">
            <div className="space-y-2 w-full">
              <label htmlFor="server-seed" className="capitalize text-sm text-foreground font-extrabold tracking-tight">
                Server Seed
              </label> 
              <Input
                id="server-seed"
                className="bg-primary-800"
                {...register('serverSeed')}
              />
            </div>
          </div>
          <div className="col-span-2">
            <div className="space-y-2 w-full">
              <label htmlFor="nonce" className="capitalize text-sm text-foreground font-extrabold tracking-tight">
                Nonce
              </label> 
              <Input
                id="nonce"
                type="number"
                className="bg-primary-800"
                {...register('nonce')}
              />
            </div>
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
      </form>

      <div className="p-8 bg-primary-800 rounded-md mt-4">
        {multiplier ? (
          <div className="flex items-center justify-center gap-4">
            <div 
              className={`text-white text-sm p-2 rounded-md`}
              style={{ backgroundColor: GAME_CONSTANTS.COLORS[multiplier as unknown as keyof typeof GAME_CONSTANTS.COLORS] }}
            >
              <span className='text-xs font-extrabold text-zinc-800'>{multiplier}</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-4">
            <CircleHelp className="text-primary-500" />
            <div className="flex flex-col">
              <strong className="text-foreground">OINK...No results found!</strong>
              <span className="text-muted-foreground text-sm">More inputs are required to verify result</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}