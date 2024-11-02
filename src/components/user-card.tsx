'use client'

import Image from "next/image"
import { useUserStore } from "@/stores/user-store"
import { DollarSign } from "lucide-react"

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Separator } from "./ui/separator"

export function UserCard() {
  const user = useUserStore()

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center justify-center bg-primary-500 p-2 rounded-md">
        <DollarSign className="size-4" strokeWidth={3} />
        <span className="font-bold text-md">
          {new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(user.amount)}
        </span>
      </div>

      <HoverCard>
        <HoverCardTrigger>
          <Image
            className="rounded-full"
            src={user.imageUrl}
            alt="Avatar do usuário"
            width={42}
            height={42}
          />
        </HoverCardTrigger>
        <HoverCardContent className="p-4 rounded-lg bg-primary-900">
          <div className="flex flex-col gap-4 p-4 bg-primary-800 rounded-md">
            <div className="flex items-center gap-4">
              <Image
                className="rounded-full"
                src={user.imageUrl}
                alt="Avatar do usuário"
                width={42}
                height={42}
              />
              <span className="font-bold text-md">{user.username}</span>
            </div>

            <Separator />

            <div className="flex flex-col gap-1">
              <span className="text-sm text-muted-foreground">{user.name}</span>
              <span className="text-sm text-muted-foreground">{user.email}</span>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
      
    </div>
  )
}