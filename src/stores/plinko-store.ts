import { create } from 'zustand'

export interface Ball {
  id: string
  directions: ('left' | 'right')[]
  drawn: boolean
  callback: () => void
}

interface PlinkoStore {
  risk: string
  rows: string
  balls: Ball[]
  setRisk: (risk: string) => void
  setRows: (rows: string) => void
  addNewBall: (direction: Ball) => void
  drawAllBalls: () => void
}

export const usePlinkoStore = create<PlinkoStore>((set) => ({
  risk: 'low',
  rows: '16',
  balls: [],

  setRisk: (risk) => set({ risk }),
  setRows: (rows) => set({ rows }),

  addNewBall: (ball) => set((state) => ({
    balls: [...state.balls, ball]
  })),

  drawAllBalls: () => set((state) => ({
    balls: state.balls.map((ball) => ({ ...ball, drawn: true }))
  })),
}))



