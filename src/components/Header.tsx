import React from 'react';
import { COMPANIONS, useAppContext } from '../AppContext';
import { Heart, Star, Coins } from 'lucide-react';
import { motion } from 'motion/react';

export function Header({ title, leftContent }: { title?: string | React.ReactNode, leftContent?: React.ReactNode }) {
  const { health, xp, level, coins, equippedCompanionId } = useAppContext();
  const currentCompanion = COMPANIONS[Math.min(level - 1, COMPANIONS.length - 1)] || COMPANIONS[0];
  
  return (
    <header className="px-container-padding py-3 w-full top-0 sticky z-50 bg-surface/85 backdrop-blur-md border-b border-outline-variant/30 shadow-sm mx-auto">
      <div className="flex items-center gap-3 w-full max-w-7xl mx-auto">
        {leftContent}
        
        <div className="w-10 h-10 rounded-full border-2 border-surface shrink-0 overflow-hidden bg-primary-container shadow-sm">
           <img src={currentCompanion.image} alt="Avatar" className="w-full h-full object-cover" />
        </div>
        
        <div className="flex-1 flex flex-col gap-1.5">
           <div className="flex flex-row items-center gap-3">
              <div className="flex-1">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider mb-1 mt-0.5">
                   <span className="text-primary flex items-center gap-1"><Star className="w-3 h-3 fill-primary"/> {level === 1 ? 'NOVICE' : level === 2 ? 'GARDEN' : 'CASTLE'}</span>
                   <span className="text-on-surface-variant opacity-70">{level >= 3 ? 'MAX' : `${xp % 100}/100`}</span>
                </div>
                <div className="h-1.5 bg-surface-container-highest rounded-full overflow-hidden border border-outline/10">
                   <motion.div 
                     className="h-full bg-primary" 
                     animate={{ width: level >= 3 ? '100%' : `${xp % 100}%` }}
                     transition={{ duration: 0.5 }}
                   />
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider mb-1 mt-0.5">
                   <span className="text-error flex items-center gap-1"><Heart className="w-3 h-3 fill-error"/> HP</span>
                   <span className="text-on-surface-variant opacity-70">{health}/100</span>
                </div>
                <div className="h-1.5 bg-surface-container-highest rounded-full overflow-hidden border border-outline/10">
                   <motion.div 
                     className={`h-full ${health <= 20 ? 'bg-error' : health <= 50 ? 'bg-orange-400' : 'bg-green-400'}`} 
                     animate={{ width: `${health}%` }}
                     transition={{ duration: 0.5 }}
                   />
                </div>
              </div>
           </div>
        </div>
        
        <div className="flex items-center gap-1.5 bg-secondary-container/50 py-1.5 px-2.5 rounded-full border border-secondary/20 shrink-0">
           <Coins className="w-4 h-4 text-orange-500" />
           <span className="text-[12px] font-bold text-on-surface">{coins}</span>
        </div>
      </div>
      
      {title && (
         <div className="mt-2 text-[20px] font-bold text-primary pl-[52px]">
            {title}
         </div>
      )}
    </header>
  );
}
