'use client'

import { DollarSign } from "lucide-react";
import { SelectRisk } from "./select-risk";
import { SelectRows } from "./select-rows";
import { usePlinkoStore } from '../../stores/usePlinkoStore'

export function PlinkForm() {
  const { 
    betAmount, 
    risk, 
    rows, 
    isDropping,
    setBetAmount, 
    dropBall 
  } = usePlinkoStore()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    dropBall()
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 text-sm font-bold space-y-4">
      <div className="space-y-2">
        <label htmlFor="betAmount">BET AMOUNT</label> 
        <div className="rounded-sm h-12 flex items-center bg-primary-800 border focus-within:border-primary-500">
          <div className="bg-green-400 p-1 mx-3 rounded-full">
            <DollarSign className="size-3 text-background"/>
          </div>
          <span className="w-px h-5 bg-zinc-400" /> 
          <input
            id="betAmount"
            className="bg-transparent outline-none mx-3 font-light"
            type="number"
            value={betAmount}
            onChange={(e) => setBetAmount(Number(e.target.value))}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="">RISK</label> 
        <SelectRisk 
          defaultValue={risk} 
          value={risk} 
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="">ROWS</label> 
        <SelectRows 
          defaultValue={rows} 
          value={rows}
        />
      </div>

      <button 
        type="submit" 
        disabled={isDropping}
        className="w-full h-12 bg-primary-500 text-white p-2 rounded-sm transition-all hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isDropping ? 'DROPPING...' : 'BET'}
      </button>
    </form>
  )
}