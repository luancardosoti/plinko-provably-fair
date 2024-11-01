import { create } from 'zustand'

interface PlinkoStore {
  isDropping: boolean
  betAmount: number
  risk: string
  rows: string
  setBetAmount: (amount: number) => void
  setRisk: (risk: string) => void
  setRows: (rows: string) => void
  dropBall: () => void
  finishBall: () => void
}

export const usePlinkoStore = create<PlinkoStore>((set, get) => ({
  isDropping: false,
  betAmount: 0,
  risk: 'low',
  rows: '16',
  
  setBetAmount: (amount) => set({ betAmount: amount }),
  setRisk: (risk) => set({ risk }),
  setRows: (rows) => set({ rows }),
  
  dropBall: () => {
    set({ isDropping: true })
  },
  finishBall: () => {
    set({ isDropping: false })
  }
})) 