import { create } from 'zustand';

interface UserStore {
  id: string
  name: string
  email: string
  username: string
  imageUrl: string
  amount: number 

  canBet: (bet: number) => boolean
  bet: (bet: number) => void
  setAmount: (amount: number) => void
}

export const useUserStore = create<UserStore>((set, get) => ({
  id: 'user-id-1',
  name: 'Luan Cardoso',
  username: 'luancardosoti',
  email: 'luancardosoti@gmail.com',
  imageUrl: 'https://github.com/luancardosoti.png',
  amount: 10000,

  canBet: (bet: number) => {
    return get().amount >= bet
  },
  bet: (bet: number) => {
    set(state => ({ amount: state.amount - bet }))
  },
  setAmount: (amount: number) => {
    set({ amount })
  }
}));