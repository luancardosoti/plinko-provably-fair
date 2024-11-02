import Image from "next/image";
import { UserCard } from "./user-card";

export function Header() {
  return (
    <header className="border-b border-gray-800 p-4">
      <div className="container mx-auto flex items-center gap-4 justify-between">
        <div className="flex items-center gap-4">
          <Image src="/pigmo.svg" alt="Pigmo" width={100} height={26} />
          <div className="w-px h-6 bg-gray-800" />
          <h1 className="text-xl font-bold tracking-widest text-primary-500 uppercase">Plinko</h1>
        </div>

        <UserCard />
      </div>
    </header>
  )
}