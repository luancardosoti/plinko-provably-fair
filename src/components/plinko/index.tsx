import { PlinkoBoard } from "./plinko-board";
import { PlinkForm } from "./plink-form";

export function Plinko() {
  return (
    <div className="border border-zinc-600 rounded-lg flex">
      <PlinkForm />
      <PlinkoBoard width={832} height={600} rows={16} />
    </div>
  )
}