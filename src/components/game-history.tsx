'use client'

import { cn } from "@/lib/utils";
import { useHistoryStore } from "@/stores/use-history-store";
import { DollarSign, Spade } from "lucide-react";
import { BetPlinkoModal } from "./bet-modal";
import { useEffect, useState } from "react";

const formatTime = (timestamp: string) => {
  return new Intl.DateTimeFormat('pt-BR', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(new Date(timestamp));
};

export function GameHistory() {
  const [mounted, setMounted] = useState(false);
  const history = useHistoryStore(state => state.history);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="mt-16 w-full max-w-6xl mx-auto px-4">
      <div className="flex items-center gap-2 mb-8">
        <Spade className="size-5 text-primary-500" />
        <h2 className="text-md font-bold tracking-tighter text-white">RECENT BETS</h2>
      </div>

      {history.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-6 tracking-tighter font-bold text-sm text-center text-muted-foreground bg-primary-800 rounded-lg py-4 px-2 lg:px-8">
            <span className="text-xs lg:text-sm text-left">GAME</span>
            <span className="text-xs lg:text-sm text-left">PLAYER</span>
            <span className="text-xs lg:text-sm">TIME</span>
            <span className="text-xs lg:text-sm">BET</span>
            <span className="text-xs lg:text-sm">MULTIPLIER</span>
            <span className="text-xs lg:text-sm">PAYOUT</span>
          </div>

          {history.slice(0, 10).map((game, index) => (
            <div 
              key={game.id} 
              className={cn(
                "grid grid-cols-6 tracking-tighter font-bold text-sm text-center text-muted-foreground bg-primary-800 rounded-lg py-4 px-2 lg:px-8 hover:filter hover:brightness-125 transition-all duration-300 items-center",
                {
                  "animate-fade-out": index === 9,
                  "animate-slide-down": index === 0
                }
              )}
            >
              <span className="text-xs lg:text-sm text-left">
                <BetPlinkoModal game={game} />
              </span>
              <span className="text-xs lg:text-sm text-left">{game.username}</span>
              <span className="text-xs lg:text-sm">
                {formatTime(game.timestamp)}
              </span>
              <div className="text-xs lg:text-sm flex items-center justify-center">
                <DollarSign className="h-3.5 w-3.5 inline-block leading-5" strokeWidth={3}/>
                <span className="-ml-1">{game.betAmount}</span>
              </div>
              <span className="text-xs lg:text-sm">{game.multiplier}x</span>
              <div className={cn("text-xs lg:text-sm flex items-center justify-center", {
                "text-green-500 font-bold": Number(game.payout) > 0,
              })}>
                <DollarSign className="h-3.5 w-3.5 inline-block leading-5" strokeWidth={3}/>
                <span className="-ml-1">{Number(game.payout).toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 