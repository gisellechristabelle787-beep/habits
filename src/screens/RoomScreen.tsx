import { useState } from 'react';
import { motion } from 'motion/react';
import { Bed, Check, Heart, Lamp, Library, Sprout } from 'lucide-react';
import { Header } from '../components/Header';
import { COMPANIONS, SHOP_ITEMS, useAppContext } from '../AppContext';

export function RoomScreen() {
  const [activeTab, setActiveTab] = useState('Room');
  const [hearts, setHearts] = useState<{ id: number; x: number }[]>([]);
  const { coins, health, equippedCompanionId, ownedItems, xp, level, skipLevel, resetProgress, unlockAllProgress } = useAppContext();
  
  const currentCompanion = COMPANIONS[Math.min(level - 1, COMPANIONS.length - 1)] || COMPANIONS[0];
  const ownedFurniture = SHOP_ITEMS.filter(item => item.type === 'furniture' && ownedItems.includes(item.id));

  const handleAvatarClick = () => {
    const newHeart = { id: Date.now(), x: Math.random() * 100 - 50 };
    setHearts(prev => [...prev, newHeart]);
    setTimeout(() => {
      setHearts(prev => prev.filter(h => h.id !== newHeart.id));
    }, 2000);
  };



  const getAvatarAnimation = () => {
    if (health <= 30) {
      return { 
        animate: { rotate: -90, y: 40, scale: 0.9, opacity: 0.7 },
        transition: { type: 'spring', damping: 15 }
      };
    }
    // Normal / Healthy
    return {
      animate: { rotate: 0, y: 0, scale: 1, opacity: 1 },
      transition: { type: 'spring', damping: 15 }
    };
  };

  const avatarAnim = getAvatarAnimation();

  return (
    <div className="flex flex-col min-h-screen pb-32">
      <Header title="My Room" />

      {/* Quick Dev Actions */}
      <div className="flex gap-2 justify-center px-4 mt-2">
         <button onClick={skipLevel} className="px-4 py-2 bg-secondary-container text-on-secondary-container rounded-full font-label-caps text-[10px] font-bold shadow-sm uppercase tracking-widest">
            Skip Level
         </button>
         <button onClick={unlockAllProgress} className="px-4 py-2 bg-primary-container text-on-primary-container rounded-full font-label-caps text-[10px] font-bold shadow-sm uppercase tracking-widest">
            Max Auto Level
         </button>
         <button onClick={resetProgress} className="px-4 py-2 bg-error-container text-on-error rounded-full font-label-caps text-[10px] font-bold shadow-sm uppercase tracking-widest">
            Restart Progress
         </button>
      </div>

      <main className="flex-1 max-w-2xl mx-auto w-full pt-4">
        {/* Hero Illustration */}
        <section className="p-container-padding pt-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="relative w-full aspect-square rounded-[32px] overflow-hidden shadow-xl shadow-primary/5 border-4 border-[rgba(255,255,255,0.5)] flex items-center justify-center bg-secondary-container/20"
          >
            {/* Background elements container (Removed, now in App.tsx) */}

            {/* Dynamic Particles based on Level */}
            {xp < 200 && (
              <div className="absolute inset-0 z-[5] overflow-hidden pointer-events-none opacity-40">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={`heart-${i}`}
                    initial={{ y: 300, x: Math.random() * 200 + 50, opacity: 0 }}
                    animate={{ y: -50, opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 4 + Math.random() * 4, delay: Math.random() * 3 }}
                    className="absolute text-error"
                  >
                    <Heart className="w-5 h-5 fill-error" />
                  </motion.div>
                ))}
              </div>
            )}
            
            {xp >= 200 && xp < 800 && (
              <div className="absolute inset-0 z-[5] overflow-hidden pointer-events-none opacity-60">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={`leaf-${i}`}
                    initial={{ y: -50, x: Math.random() * 300, rotate: 0, opacity: 0 }}
                    animate={{ y: 300, x: Math.random() * 300, rotate: 360, opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 5 + Math.random() * 5, delay: Math.random() * 4 }}
                    className="absolute text-primary"
                  >
                    <Sprout className="w-6 h-6" />
                  </motion.div>
                ))}
              </div>
            )}

            {xp >= 800 && (
              <div className="absolute inset-0 z-[5] overflow-hidden pointer-events-none opacity-50">
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={`sparkle-${i}`}
                    initial={{ scale: 0, opacity: 0, x: Math.random() * 300, y: Math.random() * 300 }}
                    animate={{ scale: [0, 1.5, 0], opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 2 + Math.random() * 2, delay: Math.random() * 2 }}
                    className="absolute w-2 h-2 rounded-full bg-yellow-300 drop-shadow-[0_0_8px_yellow]"
                  />
                ))}
              </div>
            )}

            <motion.div 
              className="relative z-10 w-48 h-48 drop-shadow-[0_10px_20px_rgba(0,0,0,0.2)] cursor-pointer"
              animate={avatarAnim.animate}
              transition={avatarAnim.transition}
              onClick={handleAvatarClick}
            >
              {hearts.map(heart => (
                <motion.div
                  key={heart.id}
                  className="absolute left-1/2 top-1/2 text-primary"
                  initial={{ opacity: 1, scale: 0.5, x: heart.x, y: 0 }}
                  animate={{ opacity: 0, scale: 1.5, y: -100 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                >
                  <Heart fill="currentColor" />
                </motion.div>
              ))}
              <img 
                alt="Mascot" 
                className="w-full h-full object-contain pointer-events-none" 
                src={currentCompanion.image} 
              />
            </motion.div>

            <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/50 flex items-center gap-2 z-20">
              <div className={`w-2 h-2 rounded-full animate-pulse ${health <= 20 ? 'bg-error' : health <= 50 ? 'bg-[orange]' : 'bg-green-400'}`}></div>
              <span className="font-ui-pixel-sm text-[10px] text-on-surface uppercase tracking-widest font-bold">Health: {health}</span>
            </div>
          </motion.div>
        </section>

        <section className="mt-stack-sm">
          <div className="px-container-padding">
            <h2 className="font-headline-sm text-on-surface font-bold mb-4">My Furniture</h2>
          </div>

          <div className="px-container-padding overflow-x-auto hide-scrollbar">
            <div className="flex gap-gutter pb-4">
              {ownedFurniture.length === 0 && (
                 <div className="text-center w-full py-4 text-on-surface-variant font-label-caps text-[12px] uppercase opacity-70">
                    No furniture added yet. Visit the Shop to get some!
                 </div>
              )}
              {ownedFurniture.map(item => (
                <div key={item.id} className="min-w-[140px] glass-card rounded-[24px] p-3 flex flex-col items-center gap-3 shadow-sm border border-white active:scale-95 transition-transform hover:border-[rgba(247,178,183,0.8)]">
                  <div className="w-20 h-20 rounded-2xl bg-secondary-fixed/30 flex items-center justify-center border-2 border-white/50 text-[32px] drop-shadow-sm overflow-hidden p-2">
                    {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-contain" /> : item.icon ? item.icon : <Check className="w-10 h-10 text-secondary" />}
                  </div>
                  <div className="text-center">
                    <p className="font-body-md text-[14px] text-on-surface mb-1 font-bold whitespace-nowrap overflow-hidden text-ellipsis w-28">{item.name}</p>
                    <span className="inline-block px-3 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant font-ui-pixel-sm text-[8px] uppercase tracking-widest font-bold">In Room</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-container-padding mt-stack-lg">
          <div className="glass-card rounded-[28px] p-container-padding flex justify-around items-center border border-white/80 shadow-md">
            <div className="text-center">
              <p className="font-label-caps text-[12px] text-on-surface-variant uppercase mb-1 font-bold tracking-widest">Comfort</p>
              <p className="font-headline-lg text-[24px] text-primary font-bold">85%</p>
            </div>
            <div className="w-px h-10 bg-outline-variant/30"></div>
            <div className="text-center">
              <p className="font-label-caps text-[12px] text-on-surface-variant uppercase mb-1 font-bold tracking-widest">Items</p>
              <p className="font-headline-lg text-[24px] text-primary font-bold">{ownedFurniture.length}/10</p>
            </div>
            <div className="w-px h-10 bg-outline-variant/30"></div>
            <div className="text-center">
              <p className="font-label-caps text-[12px] text-on-surface-variant uppercase mb-1 font-bold tracking-widest">Style</p>
              <p className="font-headline-lg text-[24px] text-primary font-bold">Lv. {Math.floor(ownedFurniture.length / 2) + 1}</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
