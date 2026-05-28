import { ArrowLeft, Bell, ChevronRight, Dog, ExternalLink, Moon, RotateCcw, Settings, Volume2, AlertTriangle, Sprout, LogOut, CheckCircle2 } from 'lucide-react';
import { COMPANIONS, useAppContext } from '../AppContext';
import { Header } from '../components/Header';

interface SettingsScreenProps {
  onBack: () => void;
}

export function SettingsScreen({ onBack }: SettingsScreenProps) {
  const { user, xp, logout, resetProgress, unlockAllProgress, level, skipToLevel2 } = useAppContext();
  
  const handleUnlockAll = () => {
    unlockAllProgress();
  };

  return (
    <div className="min-h-screen text-on-surface pb-32">
      <Header 
        leftContent={
          <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors active:scale-95 text-primary">
            <ArrowLeft className="w-6 h-6" />
          </button>
        }
        title="Settings" 
      />

      <main className="max-w-2xl mx-auto px-container-padding mt-stack-lg space-y-stack-lg">
        <section className="space-y-stack-sm">
          <div className="flex items-center gap-2 mb-2">
            <Settings className="w-4 h-4 text-primary" />
            <h2 className="font-ui-pixel-sm text-[10px] text-primary uppercase tracking-widest">App Settings</h2>
          </div>
          
          <div className="glass-card rounded-2xl shadow-warm overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-outline-variant/20">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center">
                  <Moon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-[16px]">Dark Mode</p>
                  <p className="font-body-sm text-on-surface-variant text-[12px]">Easier on the eyes at night</p>
                </div>
              </div>
              <div className="w-11 h-6 bg-outline-variant rounded-full relative cursor-pointer">
                <div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1 shadow-sm"></div>
              </div>
            </div>

            <div className="p-5 border-b border-outline-variant/20">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center">
                    <Volume2 className="w-5 h-5 text-primary" />
                  </div>
                  <p className="font-bold text-[16px]">Sound Effects</p>
                </div>
                <span className="font-ui-pixel-sm text-[10px] text-primary">80%</span>
              </div>
              <div className="w-full h-3 bg-surface-container-highest rounded-full overflow-hidden relative border border-white">
                 <div className="absolute top-0 left-0 h-full bg-primary w-4/5 rounded-full"></div>
                 <div className="absolute top-1/2 -translate-y-1/2 left-[80%] -ml-3 w-6 h-6 bg-primary border-4 border-white rounded-full shadow-sm"></div>
              </div>
            </div>

            <div className="flex items-center justify-between p-5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center">
                  <Bell className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-[16px]">Notifications</p>
                  <p className="font-body-sm text-on-surface-variant text-[12px]">Daily habit reminders</p>
                </div>
              </div>
               <div className="w-11 h-6 bg-primary rounded-full relative cursor-pointer">
                <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1 shadow-sm"></div>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-stack-sm">
          <div className="flex items-center gap-2 mb-2">
            <h2 className="font-ui-pixel-sm text-[10px] text-primary uppercase tracking-widest">Account</h2>
          </div>
          <div className="glass-card rounded-2xl shadow-warm overflow-hidden">
            <button className="w-full flex items-center justify-between p-5 border-b border-outline-variant/20 hover:bg-white/40 transition-colors text-left">
              <div className="flex items-center gap-4">
                <img alt="User" src={COMPANIONS[0].image} className="w-10 h-10 rounded-full border-2 border-primary-container object-cover" />
                <div>
                  <p className="font-bold text-[16px]">Account Info</p>
                  <p className="font-body-sm text-on-surface-variant text-[12px] truncate max-w-[200px]">{user?.email || 'Manage your email and cloud sync'}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-outline" />
            </button>

            <button 
              onClick={() => {
                onBack();
              }}
              className="w-full flex items-center justify-between p-5 border-b border-outline-variant/20 hover:bg-white/40 transition-colors text-left"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center">
                  <Dog className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-[16px]">Change Mascot</p>
                  <p className="font-body-sm text-on-surface-variant text-[12px]">Check your profile to switch companion</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-outline" />
            </button>

            <button 
              onClick={() => {
                resetProgress();
              }}
              className="w-full flex items-center justify-between p-5 hover:bg-red-50/50 transition-colors text-left group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center">
                  <RotateCcw className="w-5 h-5 text-error" />
                </div>
                <div>
                  <p className="font-bold text-error text-[16px]">Reset Progress</p>
                  <p className="font-body-sm text-error/80 text-[12px]">This action cannot be undone</p>
                </div>
              </div>
              <AlertTriangle className="w-5 h-5 text-error opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
        </section>

        <section className="space-y-stack-sm pb-10">
          <div className="flex items-center gap-2 mb-2">
            <h2 className="font-ui-pixel-sm text-[10px] text-primary uppercase tracking-widest">Support</h2>
          </div>
          <div className="glass-card rounded-2xl shadow-warm overflow-hidden">
            <button className="w-full flex items-center justify-between p-5 border-b border-outline-variant/20 hover:bg-white/40 transition-colors">
              <p className="font-bold text-[16px]">Help Center</p>
              <ExternalLink className="w-5 h-5 text-outline" />
            </button>
            <button className="w-full flex items-center justify-between p-5 border-b border-outline-variant/20 hover:bg-white/40 transition-colors">
              <p className="font-bold text-[16px]">About Pawgress</p>
              <ChevronRight className="w-5 h-5 text-outline" />
            </button>
            <button className="w-full flex items-center justify-between p-5 hover:bg-white/40 transition-colors">
              <p className="font-bold text-[16px]">Privacy Policy</p>
              <ChevronRight className="w-5 h-5 text-outline" />
            </button>
          </div>
          
          <button 
            onClick={logout}
            className="w-full mt-6 bg-surface-container-high text-on-surface font-bold rounded-2xl py-4 flex items-center justify-center gap-2 hover:bg-surface-container-highest transition-colors shadow-sm"
          >
            <LogOut className="w-5 h-5" />
            Log Out
          </button>

          <div className="flex flex-col gap-3 mt-4">
            <button 
              onClick={handleUnlockAll}
              className="w-full bg-secondary-container text-on-secondary-container font-label-caps uppercase tracking-widest text-[12px] font-bold rounded-2xl py-4 flex items-center justify-center gap-2 hover:brightness-105 transition-colors shadow-sm border border-secondary/20"
            >
              <CheckCircle2 className="w-5 h-5" />
              Developer: Auto Max Level
            </button>
            <button 
              onClick={skipToLevel2}
              className="w-full bg-primary-container text-on-primary-container font-label-caps uppercase tracking-widest text-[12px] font-bold rounded-2xl py-4 flex items-center justify-center gap-2 hover:brightness-105 transition-colors shadow-sm border border-primary/20"
            >
              <CheckCircle2 className="w-5 h-5" />
              Developer: Skip to Level 2
            </button>
            <button 
              onClick={() => {
                resetProgress();
              }}
              className="w-full bg-error text-on-error font-label-caps uppercase tracking-widest text-[12px] font-bold rounded-2xl py-4 flex items-center justify-center gap-2 hover:brightness-105 transition-colors shadow-sm"
            >
              <RotateCcw className="w-5 h-5" />
              Restart Progress
            </button>
          </div>

          <div className="flex justify-center pt-8 opacity-50">
            <div className="flex gap-2 animate-bounce">
              <div className="w-2 h-2 bg-primary-container rounded-sm"></div>
              <div className="w-2 h-2 bg-secondary-container rounded-sm"></div>
              <div className="w-2 h-2 bg-primary-container rounded-sm"></div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
