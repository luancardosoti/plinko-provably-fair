'use client'

import { useState, useEffect } from 'react';
import { PlinkoBoard } from "./plinko-board";
import { PlinkForm } from "./plink-form";
import { FairnessModal } from "../fairness-modal";

export function Plinko() {
  const [dimensions, setDimensions] = useState({ width: 840, height: 600 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const width = Math.min(window.innerWidth * 0.95, 840);
    const height = Math.min(window.innerHeight * 0.7, 600);
    setDimensions({ width, height });
    setIsMobile(window.innerWidth <= 1024);
  }, []);

  return (
    <div className="px-4">
      <div className="border rounded-2xl flex flex-col-reverse lg:flex-row overflow-hidden">
        {isMobile && (
          <div className="flex items-center justify-end py-2 px-4 sm:px-6 border-t">
            <FairnessModal />
          </div>
        )}
        <PlinkForm />
        <div className="w-full">
          <PlinkoBoard
            width={dimensions.width} 
            height={dimensions.height}           
          />
          {!isMobile && <div className="flex items-center justify-end py-2 px-4 sm:px-6 border-t">
            <FairnessModal />
          </div>}
        </div>
      </div>
    </div>
  )
}