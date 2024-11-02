'use client'

import { PlinkoBoard } from "./plinko-board";
import { PlinkForm } from "./plink-form";
import { FairnessModal } from "../fairness-modal";

export function Plinko() {
  return (
    <div>
      <div className="border rounded-2xl flex overflow-hidden">
        <PlinkForm />
        <div>
          <PlinkoBoard width={840} height={600} />
          <div className="flex items-center justify-end py-2 px-6 border-t">
            <FairnessModal />
          </div>
        </div>
      </div>
    </div>
  )
}