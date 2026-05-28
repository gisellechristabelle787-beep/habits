import { useState, useEffect, useRef } from 'react';
import { AppProvider, useAppContext, COMPANIONS } from './AppContext';
import { RoomScreen } from './screens/RoomScreen';
import { AdversariesScreen } from './screens/AdversariesScreen';
import { ClosetScreen } from './screens/ClosetScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { AuthScreen } from './screens/AuthScreen';
import { TasksScreen } from './screens/TasksScreen';
import { Home, Shirt, Swords, User, CheckSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';

type Screen = 'room' | 'tasks' | 'battle' | 'closet' | 'profile' | 'settings';

function MainApp() {
  const { user, xp, level, loading } = useAppContext();
  const [currentScreen, setCurrentScreen] = useState<Screen>('room');
  const prevLevelRef = useRef(level);
  const [showLevelUp, setShowLevelUp] = useState(false);

  useEffect(() => {
    if (level > prevLevelRef.current) {
      setShowLevelUp(true);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        zIndex: 1000
      });
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3');
      audio.play().catch(e => console.log(e));
    }
    prevLevelRef.current = level;
  }, [level]);

  if (loading) {
     return <div className="min-h-screen bg-background flex items-center justify-center font-body-md text-on-surface-variant font-bold tracking-widest uppercase">Loading...</div>;
  }

  if (!user) {
    return <AuthScreen />;
  }

  const navItems = [
    { id: 'room', label: 'Home', icon: Home, highlight: false },
    { id: 'tasks', label: 'Habits', icon: CheckSquare, highlight: false },
    { id: 'closet', label: 'Shop', icon: Shirt, highlight: false },
    { id: 'battle', label: 'Battle', icon: Swords, highlight: false },
    { id: 'profile', label: 'Profile', icon: User, highlight: true },
  ] as const;

  if (currentScreen === 'settings') {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
         <SettingsScreen onBack={() => setCurrentScreen('profile')} />
      </motion.div>
    );
  }

  const themeClass = level >= 3 ? 'theme-castle' : level === 2 ? 'theme-garden' : '';

  const getBackgroundFilter = () => {
    if (level >= 3) return 'sepia(1) hue-rotate(240deg) saturate(3) brightness(0.8)'; // Purple
    if (level === 2) return 'sepia(1) hue-rotate(70deg) saturate(3) brightness(0.9)'; // Vivid Green
    return 'none'; // Nursery (default)
  };

  return (
    <div className={`font-body-md text-on-surface min-h-screen relative max-w-[480px] lg:max-w-5xl mx-auto shadow-2xl lg:border-x border-outline-variant/30 overflow-x-hidden overflow-y-auto isolate ${themeClass}`}>
      {/* Global Background Container */}
      <div className="fixed inset-0 w-full h-full transition-colors duration-1000 overflow-hidden pointer-events-none -z-10">
        <img 
          alt="Cozy Background" 
          className="absolute w-full h-full object-cover opacity-60 transition-all duration-1000" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuD58SjiT-iC7a_dg7qACH0sW2md9WPTWnPCkpfxQAH_Y3WcuORwUEvOh7M_I87-lW4p-gIdTTlsY8Nh5t4tngQWR9M-zQRQBhq7Xj8Thl1ZznQDTcYDfjIS5kCdZc8ZTIZqGdPAEIi2qGSU3xyQwYJzVdfWXlVVHy8ZX2WYrSYqwV1-N_OOk8ITABzPhZa2bEG1S4h8lI3FV0I3z_LD6pH628OYYDio5aojrDf9Mf3mlxqoId44pr1FZtlM1errLdskOtcERTY7Gno" 
          style={{ filter: getBackgroundFilter() }}
        />
        
        {/* Overlays rendered AFTER the image so they provide a colorful gel effect */}
        {level === 1 && (
          <div className="absolute inset-0 bg-gradient-to-b from-pink-100 to-rose-50 flex items-center justify-center mix-blend-overlay">
            <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-pink-200 to-transparent" />
            <div className="absolute left-10 top-10 w-20 h-20 bg-white/40 rounded-full blur-xl" />
            <div className="absolute right-10 bottom-20 w-32 h-32 bg-rose-200/40 rounded-full blur-2xl" />
          </div>
        )}
        {level === 2 && (
          <div className="absolute inset-0 bg-gradient-to-b from-green-400 to-green-100 flex items-end mix-blend-color opacity-60">
            <div className="absolute top-10 right-10 w-24 h-24 bg-yellow-100/50 rounded-full blur-xl" />
            <div className="w-full h-1/3 bg-green-500/30 rounded-t-[100px] blur-md" />
          </div>
        )}
        {level >= 3 && (
          <div className="absolute inset-0 bg-gradient-to-b from-purple-400 via-purple-600 to-indigo-800 flex flex-col justify-end mix-blend-color opacity-60">
            <div className="absolute top-12 left-1/2 -translate-x-1/2 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl" />
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={currentScreen}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {currentScreen === 'room' && <RoomScreen />}
          {currentScreen === 'tasks' && <TasksScreen />}
          {currentScreen === 'battle' && <AdversariesScreen />}
          {currentScreen === 'closet' && <ClosetScreen />}
          {currentScreen === 'profile' && <ProfileScreen onOpenSettings={() => setCurrentScreen('settings')} />}
        </motion.div>
      </AnimatePresence>

      <nav className="absolute bottom-0 left-0 right-0 z-50 flex justify-around items-center px-4 md:px-max max-w-2xl mx-auto pb-6 pt-2 bg-surface/80 backdrop-blur-xl border-t border-outline-variant/30 shadow-[0_-8px_20px_rgba(133,79,84,0.1)] rounded-t-3xl">
        {navItems.map((item) => {
          const isActive = currentScreen === item.id;
          const Icon = item.icon;
          
          if (item.highlight) {
            return (
               <button
                key={item.id}
                onClick={() => setCurrentScreen(item.id)}
                className={`flex flex-col items-center justify-center rounded-full px-5 py-2 transition-all duration-300 ease-out active:scale-95 ${isActive ? 'bg-secondary-container text-on-secondary-container scale-110 shadow-md' : 'text-on-surface-variant hover:bg-secondary-container/50'}`}
              >
                <Icon className={`w-6 h-6 ${isActive ? 'fill-current' : ''}`} />
                <span className="font-label-caps text-[10px] uppercase font-bold tracking-widest mt-1">{item.label}</span>
              </button>
            )
          }

          return (
            <button
              key={item.id}
              onClick={() => setCurrentScreen(item.id)}
              className={`flex flex-col items-center justify-center p-2 transition-all duration-300 active:scale-90 active:rotate-2 ${isActive ? 'text-primary' : 'text-on-surface-variant hover:bg-secondary-fixed/30 hover:text-primary rounded-full'}`}
            >
              <Icon className={`w-6 h-6 ${isActive ? 'fill-primary/20' : ''}`} />
              <span className={`font-label-caps text-[10px] uppercase tracking-widest mt-1 ${isActive ? 'font-bold' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
      
      <AnimatePresence>
        {showLevelUp && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowLevelUp(false)}
            className="absolute inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-6"
          >
            <motion.div 
              initial={{ scale: 0.5, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-surface rounded-[32px] p-8 flex flex-col items-center justify-center text-center max-w-sm w-full shadow-2xl border-2 border-primary/20"
            >
              <h2 className="text-3xl font-display text-primary mb-2 uppercase tracking-wide font-black drop-shadow-sm">Congratulations!</h2>
              <p className="text-lg text-on-surface mb-6 font-bold tracking-wide">You reached Level {level}!</p>
              <img src={COMPANIONS[Math.min(level - 1, COMPANIONS.length - 1)]?.image} className="w-48 h-48 object-contain mb-8 filter drop-shadow-xl" />
              <p className="font-ui-pixel-sm text-[12px] opacity-70 animate-pulse uppercase tracking-widest font-bold">Tap anywhere to continue</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen">
        <MainApp />
      </div>
    </AppProvider>
  );
}
