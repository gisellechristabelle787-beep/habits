import React, { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react';
import { db, auth, signInWithGoogle, signOutUser } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export type Task = { id: string; text: string; completed: boolean; xpReward: number; healthReward: number; completionCount: number; };
export type User = { email: string; uid: string };

export interface Companion {
  id: string;
  name: string;
  levelRequired: number;
  image: string;
  filter?: string;
}

export const COMPANIONS: Companion[] = [
  { id: '1', name: 'Buddy (Novice)', levelRequired: 1, image: 'https://res.cloudinary.com/dhbxrnxd5/image/upload/v1779959328/Screenshot_2026-05-28_at_11.23.05-removebg-preview_rcmzjb.png' },
  { id: '2', name: 'Luna (Garden)', levelRequired: 2, image: 'https://res.cloudinary.com/dhbxrnxd5/image/upload/v1779939169/copy_of_screenshot_2026-05-28_at_081146_tzm9ph.png' },
  { id: '3', name: 'Apex (Castle)', levelRequired: 3, image: 'https://res.cloudinary.com/dhbxrnxd5/image/upload/v1779959321/Screenshot_2026-05-28_at_11.04.31-removebg-preview_d9gkor.png' },
];

export type ItemType = 'clothing' | 'hat' | 'accessory' | 'furniture';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string | React.ReactNode;
  rarity: 'common' | 'rare' | 'legendary';
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: '1', title: 'First Steps', description: 'Complete your first task.', icon: <img src="https://res.cloudinary.com/dhbxrnxd5/image/upload/v1779973326/Screenshot_2026-05-28_at_19.58.34-removebg-preview_l706is.png" alt="First Steps" className="w-full h-full object-contain drop-shadow-md" />, rarity: 'common' },
  { id: '2', title: '7 Day Master', description: 'Log in and play for 7 days in a row.', icon: <img src="https://res.cloudinary.com/dhbxrnxd5/image/upload/v1779973324/Screenshot_2026-05-28_at_19.58.41-removebg-preview_jhtwom.png" alt="7 Day Master" className="w-full h-full object-contain drop-shadow-md" />, rarity: 'rare' },
  { id: '3', title: 'No Miss Day Reward', description: 'Complete all tasks for 3 consecutive days.', icon: <img src="https://res.cloudinary.com/dhbxrnxd5/image/upload/v1779973324/Screenshot_2026-05-28_at_19.58.31-removebg-preview_c2yrtp.png" alt="No Miss Day Reward" className="w-full h-full object-contain drop-shadow-md" />, rarity: 'legendary' },
  { id: '4', title: 'Enemy Survivors', description: 'Defeat all enemy levels.', icon: <img src="https://res.cloudinary.com/dhbxrnxd5/image/upload/v1779973324/Screenshot_2026-05-28_at_19.58.45-removebg-preview_o0i6za.png" alt="Enemy Survivors" className="w-full h-full object-contain drop-shadow-md" />, rarity: 'rare' },
];

export interface ShopItem {
  id: string;
  name: string;
  type: ItemType;
  price: number;
  image?: string;
  icon?: string;
}

export const SHOP_ITEMS: ShopItem[] = [
  // Clothing
  { id: 'c1', name: 'Raincoat', type: 'clothing', price: 100, image: 'https://res.cloudinary.com/dhbxrnxd5/image/upload/v1779941892/copy_of_screenshot_2026-05-28_at_105336_vgthyw.png' },
  { id: 'c2', name: 'Dinosaur jumpsuit', type: 'clothing', price: 150, image: 'https://res.cloudinary.com/dhbxrnxd5/image/upload/v1779940763/copy_of_screenshot_2026-05-28_at_081029_bz38g1.png' },
  { id: 'c3', name: 'Blue jumper', type: 'clothing', price: 120, image: 'https://res.cloudinary.com/dhbxrnxd5/image/upload/v1779940740/copy_of_screenshot_2026-05-28_at_081023_dw7xax.png' },

  // Accessories
  { id: 'a1', name: 'Crown', type: 'accessory', price: 200, image: 'https://res.cloudinary.com/dhbxrnxd5/image/upload/v1779940661/copy_of_screenshot_2026-05-28_at_081038_pzoaik.png' },
  { id: 'a2', name: 'Bow', type: 'accessory', price: 50, image: 'https://res.cloudinary.com/dhbxrnxd5/image/upload/v1779940714/copy_of_screenshot_2026-05-28_at_081033_i3n8nb.png' },
  { id: 'a3', name: 'Backpack', type: 'accessory', price: 100, image: 'https://res.cloudinary.com/dhbxrnxd5/image/upload/v1779940632/copy_of_screenshot_2026-05-28_at_081109_qvz4hm.png' },

  // Furniture
  { id: 'f1', name: 'Mushroom', type: 'furniture', price: 75, image: 'https://res.cloudinary.com/dhbxrnxd5/image/upload/v1779939337/copy_of_screenshot_2026-05-28_at_081139_f4egke.png' },
  { id: 'f2', name: 'Bean bag', type: 'furniture', price: 150, image: 'https://res.cloudinary.com/dhbxrnxd5/image/upload/v1779940074/copy_of_screenshot_2026-05-28_at_081123_recfee.png' },
  { id: 'f3', name: 'Cactus', type: 'furniture', price: 50, image: 'https://res.cloudinary.com/dhbxrnxd5/image/upload/v1779939909/copy_of_screenshot_2026-05-28_at_081127_nndwmw.png' },
];

interface AppState {
  user: User | null;
  tasks: Task[];
  xp: number;
  coins: number;
  health: number;
  level: number;
  equippedCompanionId: string | null;
  equippedOutfitId: string | null;
  defeatedAdversaries: string[];
  ownedItems: string[];
  unlockedAchievements: string[];
  history: any[];
  streak: number;
  streakMultiplier: number;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  addTask: (text: string) => void;
  toggleTask: (id: string) => void;
  resetProgress: () => void;
  unlockAllProgress: () => void;
  skipLevel: () => void;
  equipCompanion: (id: string) => void;
  equipOutfit: (id: string) => void;
  unlockAchievement: (id: string) => void;
  handleBattleResult: (adversaryId: string, won: boolean) => void;
  buyItem: (id: string, price: number) => void;
  setXp: React.Dispatch<React.SetStateAction<number>>;
}

const AppContext = createContext<AppState | undefined>(undefined);

const STORAGE_KEY = 'pawgress_state';

const DEFAULT_TASKS: Task[] = [
  { id: 't1', text: 'Food Tracker', completed: false, xpReward: 50, healthReward: 10, completionCount: 0 },
  { id: 't2', text: 'Journal', completed: false, xpReward: 50, healthReward: 15, completionCount: 0 },
  { id: 't3', text: 'Flashcards', completed: false, xpReward: 50, healthReward: 20, completionCount: 0 },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>(DEFAULT_TASKS);
  const [xp, setXp] = useState(0);
  const [coins, setCoins] = useState(0);
  const [health, setHealth] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lastHabitDate, setLastHabitDate] = useState<string | null>(null);
  const [equippedCompanionId, setEquippedCompanionId] = useState<string | null>('1');
  const [equippedOutfitId, setEquippedOutfitId] = useState<string | null>(null);
  const [defeatedAdversaries, setDefeatedAdversaries] = useState<string[]>([]);
  const [ownedItems, setOwnedItems] = useState<string[]>([]);
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);
  const syncInProgress = useRef(false);
  const lastStateHash = useRef('');

  useEffect(() => {
    return auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        setUser({ email: firebaseUser.email || '', uid: firebaseUser.uid });
        // Load data from Firebase
        const docRef = doc(db, 'users', firebaseUser.uid);
        const snapshot = await getDoc(docRef);
        
        let parsed = snapshot.exists() ? snapshot.data() : null;
        
        if (parsed) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const lastLogin = parsed.lastLoginDate ? new Date(parsed.lastLoginDate) : new Date(0);
          lastLogin.setHours(0, 0, 0, 0);
          const diffDays = (today.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24);

          let updatedStreak = parsed.streak || 0;
          if (diffDays > 1) {
            updatedStreak = 0;
          }

          let updatedTasks = parsed.tasks && parsed.tasks.length ? parsed.tasks : DEFAULT_TASKS;
          let todayStr = new Date().toDateString();
          
          if (parsed.lastLoginDate !== todayStr) {
             updatedTasks = updatedTasks.map((t: any) => ({ ...t, completed: false, completionCount: t.completionCount || 0 }));
          }

          setTasks(updatedTasks);
          setXp(parsed.xp || 0);
          setCoins(parsed.coins || 0);
          setHealth(parsed.health ?? 0);
          setStreak(updatedStreak);
          setLastHabitDate(parsed.lastHabitDate || null);
          setEquippedCompanionId(parsed.equippedCompanionId || '1');
          setEquippedOutfitId(parsed.equippedOutfitId || null);
          setDefeatedAdversaries(parsed.defeatedAdversaries || []);
          setOwnedItems(parsed.ownedItems || []);
          setUnlockedAchievements(parsed.unlockedAchievements || []);
          setHistory(parsed.history || []);
        } else {
           // Initial values for new user
           setTasks(DEFAULT_TASKS);
           setXp(0);
           setCoins(0);
           setHealth(0);
           setStreak(0);
           setHistory([]);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
  }, []);

  // Save to Firebase whenever state changes
  useEffect(() => {
    if (!user || loading) return;

    const stateToSave = {
      xp, coins, health, streak, lastHabitDate,
      equippedCompanionId, equippedOutfitId, defeatedAdversaries, ownedItems, unlockedAchievements, history,
      lastLoginDate: new Date().toDateString(),
      email: user.email,
      tasks
    };

    const hash = JSON.stringify(stateToSave);
    if (lastStateHash.current === hash) return;
    lastStateHash.current = hash;

    if (!syncInProgress.current) {
       syncInProgress.current = true;
       // debounce the save
       setTimeout(async () => {
         try {
           await setDoc(doc(db, 'users', user.uid), JSON.parse(lastStateHash.current), { merge: true });
         } catch (e) {
           console.error("Firebase save error", e);
         } finally {
           syncInProgress.current = false;
         }
       }, 500);
    }
  }, [user, tasks, xp, coins, health, streak, lastHabitDate, equippedCompanionId, equippedOutfitId, defeatedAdversaries, ownedItems, unlockedAchievements, history, loading]);

  let level = 1;
  
  if (xp >= 200) {
    level = 3;
  } else if (xp >= 100) {
    level = 2;
  }

  const streakMultiplier = streak >= 7 ? 1.5 : streak >= 3 ? 1.2 : 1.0;

  const login = async () => {
    await signInWithGoogle();
  };
  
  const logout = async () => {
    await signOutUser();
  };
  
  const addTask = (text: string) => {
    if (!text.trim()) return;
    setTasks((prev) => [...prev, { id: Math.random().toString(36).substring(2, 9), text, completed: false, xpReward: 10, healthReward: 10, completionCount: 0 }]);
  };

  const toggleTask = (id: string) => {
    setTasks((prev) => {
      const updatedTasks = prev.map((t) => {
        if (t.id === id) {
          const isCompleting = !t.completed;
          if (isCompleting) {
            setXp(x => x + t.xpReward);
            
            setHealth(currentHealth => {
              const nextHealth = Math.min(100, currentHealth + t.healthReward);
              if (nextHealth === 100 && currentHealth < 100) {
                // Reward full health bonus only once when reaching 100
                setCoins(c => c + Math.floor(50 * streakMultiplier));
              }
              return nextHealth;
            });
            
            // Base coins per task completion
            setCoins(c => c + Math.floor(10 * streakMultiplier));

            unlockAchievement('1');
          }
          return { ...t, completed: isCompleting, completionCount: isCompleting ? (t.completionCount || 0) + 1 : (Math.max(0, (t.completionCount || 0) - 1)) };
        }
        return t;
      });

      const previouslyAllCompleted = prev.length > 0 && prev.every(t => t.completed);
      const todayStr = new Date().toDateString();
      if (!previouslyAllCompleted && lastHabitDate !== todayStr && updatedTasks.some(t => t.completed)) {
         setStreak(s => {
           const newStreak = s + 1;
           if (newStreak >= 7) unlockAchievement('2');
           return newStreak;
         });
         setLastHabitDate(todayStr);
      }

      // Perfect Day Check
      const allCompleted = updatedTasks.length > 0 && updatedTasks.every(t => t.completed);
      
      if (allCompleted && !previouslyAllCompleted) {
        // Just achieved perfect day!
        setXp(x => x + 50);
        setCoins(c => c + 25);
        
        let shouldUnlock3 = false;
        
        setHistory(h => {
             const newH = [...h];
             const todayIndex = newH.findIndex(item => item.date === todayStr);
             if (todayIndex >= 0) {
               newH[todayIndex].perfect = true;
             } else {
               newH.push({ date: todayStr, xp: 50, completedCount: updatedTasks.length, perfect: true });
             }
             
             newH.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
             
             let consecutivePerfect = 0;
             let lastDate: Date | null = null;
             for (let i = newH.length - 1; i >= 0; i--) {
               if (newH[i].perfect) {
                 const currDate = new Date(newH[i].date);
                 if (lastDate != null) {
                    const diffDays = (lastDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24);
                    // allow < 1.5 in case of DST etc
                    if (diffDays > 1.5) {
                      break;
                    }
                 }
                 consecutivePerfect++;
                 lastDate = currDate;
               } else {
                 break;
               }
             }
             
             if (consecutivePerfect >= 3) {
               shouldUnlock3 = true;
             }
             
             return newH;
        });
        
        if (shouldUnlock3) {
           unlockAchievement('3');
        }

      } else if (!allCompleted && previouslyAllCompleted) {
         setHistory(h => {
             const newH = [...h];
             const todayIndex = newH.findIndex(item => item.date === todayStr);
             if (todayIndex >= 0) {
               newH[todayIndex].perfect = false;
             }
             return newH;
         });
      } else if (allCompleted || !allCompleted) {
         setHistory(h => {
             const newH = [...h];
             const todayIndex = newH.findIndex(item => item.date === todayStr);
             const completedCount = updatedTasks.filter(t => t.completed).length;
             
             if (todayIndex >= 0) {
               newH[todayIndex].completedCount = completedCount;
             } else {
               newH.push({ date: todayStr, xp: 0, completedCount: completedCount, perfect: allCompleted });
             }
             return newH;
         });
      }

      return updatedTasks;
    });
  };

  const equipCompanion = (id: string) => setEquippedCompanionId(id);
  const equipOutfit = (id: string) => setEquippedOutfitId(id === equippedOutfitId ? null : id);

  const unlockAchievement = (id: string) => {
    if (!unlockedAchievements.includes(id)) {
      setUnlockedAchievements(prev => [...prev, id]);
    }
  };

  const handleBattleResult = (adversaryId: string, won: boolean) => {
    if (won) {
      setDefeatedAdversaries(prev => {
        const next = [...prev, adversaryId];
        // Slime, bunny, fox = 3 distinct enemies.
        // Replace with actual max if you change ADVERSARIES
        if (next.length >= 3) {
          unlockAchievement('4');
        }
        return next;
      });
      setXp(x => x + 50);
      setCoins(c => c + 25);
    } else {
      setXp(x => Math.max(0, x - 20)); // Lose XP on defeat
    }
  };

  const buyItem = (id: string, price: number) => {
    if (coins >= price && !ownedItems.includes(id)) {
      setCoins(c => c - price);
      setOwnedItems(prev => [...prev, id]);
      
      // Play a quick synth "ka-ching" sound
      try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContext();
        
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
        
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.3);
      } catch (e) {
        // Ignore if audio API isn't available
      }
    }
  };

  const resetProgress = () => {
    setTasks([
      { id: 't1', text: 'Food Tracker', completed: false, xpReward: 50, healthReward: 10, completionCount: 0 },
      { id: 't2', text: 'Journal', completed: false, xpReward: 50, healthReward: 15, completionCount: 0 },
      { id: 't3', text: 'Flashcards', completed: false, xpReward: 50, healthReward: 20, completionCount: 0 },
    ]);
    setXp(0);
    setCoins(0);
    setHealth(100);
    setStreak(0);
    setLastHabitDate(null);
    setEquippedCompanionId('1');
    setEquippedOutfitId(null);
    setDefeatedAdversaries([]);
    setOwnedItems([]);
    setUnlockedAchievements([]);
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const unlockAllProgress = () => {
    setXp(p => p + 10000);
    setCoins(c => c + 10000);
    setHealth(100);
    setUnlockedAchievements(ACHIEVEMENTS.map(a => a.id));
  };

  const skipLevel = () => {
    if (level === 1) {
      setXp(Math.max(xp, 100));
    } else if (level === 2) {
      setXp(Math.max(xp, 200));
    } else {
      setXp(Math.max(xp + 100, 300));
    }
  };

  return (
    <AppContext.Provider value={{ 
      user, tasks, xp, coins, health, level, streak, streakMultiplier, loading,
      equippedCompanionId, equippedOutfitId, defeatedAdversaries, ownedItems, unlockedAchievements, history,
      login, logout, addTask, toggleTask, resetProgress, unlockAllProgress, skipLevel,
      equipCompanion, equipOutfit, unlockAchievement, handleBattleResult, buyItem, setXp
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}

