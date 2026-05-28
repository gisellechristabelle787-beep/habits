import { Heart, HeartHandshake, Settings, Trophy, Lock, CheckCircle, Sparkles, Flame, CheckSquare } from 'lucide-react';
import { Header } from '../components/Header';
import { COMPANIONS, ACHIEVEMENTS, useAppContext } from '../AppContext';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays, parseISO } from 'date-fns';

interface ProfileScreenProps {
  onOpenSettings: () => void;
}

export function ProfileScreen({ onOpenSettings }: ProfileScreenProps) {
  const { level, xp, coins, health, tasks, streak, streakMultiplier, defeatedAdversaries, equippedCompanionId, equipCompanion, unlockedAchievements, history } = useAppContext();
  const completedCount = tasks.filter(t => t.completed).length;

  const currentCompanion = COMPANIONS[Math.min(level - 1, COMPANIONS.length - 1)] || COMPANIONS[0];

  const getHealthStatus = () => {
    if (health <= 20) return 'SICK';
    if (health <= 50) return 'WEAK';
    if (health <= 70) return 'RECOVERING';
    if (health < 95) return 'HEALTHY';
    return 'THRIVING';
  };

  const chartData = Array.from({ length: 7 }).map((_, i) => {
    const d = subDays(new Date(), 6 - i);
    const dateStr = d.toDateString();
    const dayLabel = format(d, 'EEE');
    const dayHistory = history?.find(h => h.date === dateStr);
    return {
      dayLabel,
      completed: dayHistory ? dayHistory.completedCount || 0 : 0,
      xp: dayHistory ? dayHistory.xp || 0 : 0
    };
  });

  return (
    <div className="min-h-screen text-on-surface font-body-md pb-32">
      <Header 
        title="Profile" 
        leftContent={
          <button onClick={onOpenSettings} className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-primary-container/50 transition-colors active:scale-95 duration-200">
            <Settings className="w-6 h-6 text-primary" />
          </button>
        }
      />

      <main className="pt-6 px-container-padding max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
        {/* Left Column */}
        <div className="flex-1 flex flex-col gap-6">
          {/* User Info Card */}
          <section className="glass-card rounded-xl p-6 shadow-warm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-label-caps text-[12px] text-secondary uppercase tracking-widest">Global Rank</p>
                <h2 className="font-headline-xl text-[32px] font-bold tracking-tight text-primary">{level === 1 ? 'Novice' : level === 2 ? 'Garden' : 'Castle'}</h2>
              </div>
              <div className="bg-primary text-on-primary px-4 py-2 rounded-full font-headline-lg text-[24px] font-bold">
                LV. {level}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <span className="font-label-caps text-[12px] text-on-surface-variant uppercase">Next Evolution</span>
                <span className="font-ui-pixel-sm text-[10px] text-secondary tracking-widest font-bold">
                   {level >= 3 ? 'MAX LEVEL' : `${xp % 100} / 100 XP (${xp % 100}%)`}
                </span>
              </div>
              <div className="h-4 w-full bg-surface-container rounded-full overflow-hidden border border-outline-variant/20 relative">
                <div 
                  className="h-full bg-gradient-to-r from-primary-container to-primary relative transition-all duration-500 ease-out" 
                  style={{ width: level >= 3 ? '100%' : `${xp % 100}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2">
                    <Heart className="w-4 h-4 text-primary fill-primary" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Stats Summary Bento */}
          <section className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="glass-card rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-warm">
              <Flame className={`w-6 h-6 mb-2 ${streak > 0 ? 'text-orange-500 fill-orange-500/20' : 'text-on-surface-variant'}`} />
              <p className="font-ui-pixel-sm text-[10px] text-secondary uppercase tracking-widest">Day Streak</p>
              <div className="flex items-end gap-1">
                 <p className="font-headline-lg text-[24px] text-primary font-bold">{streak}</p>
                 {streakMultiplier > 1.0 && (
                   <span className="font-label-caps text-[10px] text-orange-500 font-bold mb-1">x{streakMultiplier}</span>
                 )}
              </div>
            </div>
            <div className="glass-card rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-warm">
              <Trophy className="w-6 h-6 text-primary mb-2" />
              <p className="font-ui-pixel-sm text-[10px] text-secondary uppercase tracking-widest">Defeated</p>
              <p className="font-headline-lg text-[24px] text-primary font-bold">{defeatedAdversaries.length}</p>
            </div>
            <div className="col-span-2 md:col-span-1 glass-card rounded-xl p-4 flex flex-col items-center justify-center shadow-warm">
               <p className="font-ui-pixel-sm text-[10px] text-secondary uppercase tracking-widest mb-1">Total Points</p>
               <p className="font-headline-xl text-[28px] text-primary font-bold tracking-tight">{coins}</p>
            </div>
            <div className="col-span-2 md:col-span-3 glass-card rounded-xl p-4 flex items-center justify-between shadow-warm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center">
                   <HeartHandshake className="w-5 h-5 text-error" />
                </div>
                <div>
                  <p className="font-ui-pixel-sm text-[10px] text-error uppercase tracking-widest">Health State</p>
                  <p className="font-headline-lg text-[20px] text-primary font-bold">{getHealthStatus()}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Habit Statistics */}
          <section className="space-y-stack-sm">
            <h3 className="font-headline-lg text-[20px] text-on-surface font-bold">Habit Log</h3>
            <div className="flex flex-col gap-3">
              {tasks.map(t => (
                 <div key={t.id} className="glass-card rounded-xl p-4 flex justify-between items-center shadow-sm">
                   <div className="flex items-center gap-3">
                      <CheckSquare className={`w-5 h-5 ${t.completed ? 'text-primary' : 'text-on-surface-variant'}`} />
                      <span className="font-body-md text-primary font-bold">{t.text}</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <span className="font-label-caps text-on-surface-variant text-[10px] uppercase tracking-widest">Completed</span>
                      <span className="bg-primary-container text-on-primary-container px-3 py-1 rounded-full font-bold text-[12px]">{t.completionCount || 0} times</span>
                   </div>
                 </div>
              ))}
            </div>
          </section>

          {/* Growth Chart */}
          <section className="space-y-stack-sm mt-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-headline-lg text-[20px] text-on-surface font-bold">7-Day Growth</h3>
            </div>
            <div className="glass-card rounded-xl p-4 shadow-warm h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#34D399" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#34D399" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="dayLabel" 
                    tick={{ fill: '#374151', fontSize: 10, fontWeight: 600 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    tick={{ fill: '#374151', fontSize: 10 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: '#064E3B', fontWeight: 'bold' }}
                    labelStyle={{ color: '#374151', fontWeight: 'bold' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="completed" 
                    name="Tasks Completed"
                    stroke="#10B981" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorCompleted)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Companions Section */}
          <section className="space-y-stack-sm">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-headline-lg text-[24px] text-on-surface font-bold">My Companions</h3>
              <button className="text-primary font-label-caps text-[12px] uppercase">View All</button>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar -mx-container-padding px-container-padding">
              {COMPANIONS.map((companion) => {
                const isLocked = companion.levelRequired > level;
                const isEquipped = companion.id === equippedCompanionId;

                return (
                  <div 
                    key={companion.id}
                    onClick={() => !isLocked && equipCompanion(companion.id)}
                    className={`flex-shrink-0 w-40 glass-card rounded-xl p-4 shadow-warm text-center group transition-all relative ${!isLocked ? 'cursor-pointer active:scale-95' : 'opacity-75'} ${isEquipped ? 'border-2 border-primary-fixed shadow-md' : 'border-2 border-transparent hover:border-primary-container/30'}`}
                  >
                    <div className="aspect-square bg-secondary-container/30 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                      <img 
                        alt={companion.name} 
                        className={`w-full h-full object-contain p-2 ${isLocked ? 'grayscale opacity-50' : ''}`} 
                        src={companion.image} 
                        style={{ filter: companion.filter }}
                      />
                    </div>
                    <p className="font-headline-lg text-[18px] text-primary truncate font-bold">{companion.name}</p>
                    
                    {isLocked ? (
                      <p className="font-ui-pixel-sm text-[10px] text-on-surface-variant bg-surface-container rounded px-2 py-0.5 mt-1 inline-flex items-center gap-1 uppercase tracking-widest"><Lock className="w-3 h-3"/> LVL {companion.levelRequired}</p>
                    ) : isEquipped ? (
                      <p className="font-ui-pixel-sm text-[10px] text-on-primary bg-primary rounded px-2 py-0.5 mt-1 inline-flex items-center gap-1 uppercase tracking-widest"><CheckCircle className="w-3 h-3"/> EQUIPPED</p>
                    ) : (
                      <p className="font-ui-pixel-sm text-[10px] text-secondary bg-surface-container rounded px-2 py-0.5 mt-1 inline-block uppercase hover:bg-secondary-container transition-colors tracking-widest cursor-pointer">EQUIP</p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Achievements & Badges Shelf */}
          <section className="space-y-stack-sm">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-headline-lg text-[24px] text-on-surface font-bold">Trophy Shelf</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {ACHIEVEMENTS.map((achievement) => {
                const isUnlocked = unlockedAchievements.includes(achievement.id);
                
                return (
                  <div 
                    key={achievement.id}
                    className={`glass-card rounded-xl p-3 shadow-warm relative overflow-hidden transition-all duration-300 ${
                      isUnlocked 
                        ? 'border border-primary/20 shadow-[0_0_15px_rgba(52,211,153,0.15)] group hover:scale-[1.02]' 
                        : 'border-transparent opacity-60 grayscale filter hover:opacity-80'
                    }`}
                  >
                    {/* subtle glow for unlocked */}
                    {isUnlocked && (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
                    )}
                    
                    <div className="flex flex-col items-center text-center gap-2">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-[24px] ${isUnlocked ? 'bg-primary-container drop-shadow-md' : 'bg-surface-container border border-outline-variant/30'} transition-colors`}>
                        {isUnlocked ? achievement.icon : <Lock className="w-5 h-5 text-on-surface-variant/50" />}
                      </div>
                      
                      <div className="space-y-1">
                        <p className="font-headline-lg text-[13px] text-primary font-bold leading-tight">
                          {achievement.title}
                        </p>
                        
                        {isUnlocked ? (
                          <p className="font-body-sm text-[10px] text-on-surface-variant line-clamp-2 leading-tight">
                            {achievement.description}
                          </p>
                        ) : (
                          <p className="font-ui-pixel-sm text-[8px] text-secondary tracking-widest uppercase">
                            Locked
                          </p>
                        )}
                      </div>
                      
                      {/* Rarity Indicator */}
                      {isUnlocked && (
                        <span className={`text-[8px] uppercase tracking-widest px-2 py-0.5 rounded-sm font-bold ${
                          achievement.rarity === 'legendary' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                          achievement.rarity === 'rare' ? 'bg-purple-100 text-purple-700 border border-purple-200' :
                          'bg-blue-100 text-blue-700 border border-blue-200'
                        }`}>
                          {achievement.rarity}
                        </span>
                      )}
                    </div>
                    
                    {/* Gentle Sparkles on Hover using group-hover if it's unlocked */}
                    {isUnlocked && (
                       <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500">
                         <Sparkles className="w-3 h-3 absolute top-1 left-2 text-yellow-400 animate-pulse" />
                         <Sparkles className="w-4 h-4 absolute bottom-2 right-1 text-yellow-300 animate-ping" style={{ animationDuration: '2s' }} />
                       </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Evolution Guide */}
          <section className="space-y-stack-sm">
            <h3 className="font-headline-lg text-[20px] text-on-surface font-bold">Evolution Guide</h3>
            <div className="relative overflow-hidden glass-card rounded-xl shadow-warm border-2 border-primary-container/20">
              <div className="p-6">
                <img alt="Evolution Path" className="w-full rounded-lg mb-4" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCg3nhSRRGaG7-yD1FT1ssB65fbsiEzo5rDKWQE-x9ul8l2u1O9GgzfxIE753s1nX1y4enXPbAG_MFWMO5if47IhFRMTszqDSO7YH4afh6aQHw8dfRhffC9-gCh-aliyQwJ8sFtuqjGfjxQUI3klwHQKUvgBZ-DYVvDb5_uyUzkDbecmDE6g_j199MiQufEOKvDP8zs1jO6-1DmnnGODIMT1E1SvX6O42TuW2yvFLhMXY3v_dWR_ug9HjKYZT5wJJye7lZT0q9Mwng" />
                <div className="text-center">
                  <h4 className="font-headline-lg text-[20px] text-primary mb-1 font-bold">Master Your Growth</h4>
                  <p className="font-body-sm text-[14px] text-on-surface-variant">Every habit completed brings your companion closer to their final form. Keep it up!</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
