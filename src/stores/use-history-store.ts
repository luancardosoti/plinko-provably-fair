import { parseCookies, setCookie } from 'nookies';
import { create } from 'zustand';

export interface GameHistory {
  id: string;
  username: string;
  betAmount: string;
  multiplier: string;
  payout: string;
  timestamp: string;

  serverSeed: string;
  serverSeedHash: string;
  clientSeed: string;
  nonce: number;
}

interface AddGameParams {
  username: string;
  betAmount: string;
  multiplier: string;
  payout: string;

  serverSeed: string;
  serverSeedHash: string;
  clientSeed: string;
  nonce: number;
}

interface HistoryStore {
  history: GameHistory[];
  addGameResult: (game: AddGameParams) => void;
}

export const useHistoryStore = create<HistoryStore>((set, get) => ({
  history: getInitialHistory(),
  addGameResult: (game: AddGameParams) => {
    const history = get().history
    const newHistory = [
      {
        id: Math.random().toString(),
        timestamp: new Date().toISOString(),
        ...game,
      },
      ...history
    ]

    set(({ history: newHistory }));
    setCookie(null, 'history', JSON.stringify(newHistory), { path: '/' });
  },
}));

function getInitialHistory() {
  const cookies = parseCookies();
  const history = cookies.history;
  
  return history ? JSON.parse(history) : [];
}