import { Sparkles, Medal, Coins, Swords, Trophy, X, Brain, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from '../components/Header';
import { COMPANIONS, useAppContext } from '../AppContext';
import { useState } from 'react';

const QUIZZES = [
  { question: "What is the recommended hours of sleep for an adult?", options: ["4-5", "6", "7-9", "10-12"], answer: "7-9" },
  { question: "Which vitamin is heavily associated with sunlight?", options: ["Vitamin A", "Vitamin B", "Vitamin C", "Vitamin D"], answer: "Vitamin D" },
  { question: "Hydration is important. Roughly what percentage of the human body is water?", options: ["40%", "60%", "80%", "95%"], answer: "60%" }
];

const ADVERSARIES = [
  {
    id: 'slime',
    name: 'Nibble the Slime',
    hp: 100,
    xp: 100,
    coins: 50,
    stars: 2,
    reqLevel: 1,
    reqMob: null,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBoEg81Tb0kC9vTdg5d3CXDTFupWIJmIcFa9P5APVYEwgm_TlAGcxyST7VqkYhnhiZ72vT7WzeZG20Ospm7QeVlzO1EAJXWh3haLu03qIztZ7Th0ZfzltS-v3v9267ajBVnyR9m1VJFk-GQvM5AMsfRuQAsei1tyHq_dQhR4VAgTu5NzXnZCqO1AfdqjrJ0VmWGaNgyIUK7gjQPyYZBRvaNBPg75MFGD90wI8Qu6k3m56stNGqidmZBQM2GehLUyhJ275_YC7ra0JY',
    bg: 'bg-primary-container/30',
    border: 'border-primary-container'
  },
  {
    id: 'bunny',
    name: 'Gloomy Bunny',
    hp: 250,
    xp: 150,
    coins: 75,
    stars: 3,
    reqLevel: 2,
    reqMob: 'slime',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC14pbn9l5fIRTA6neUsWGzGvloQ7LnPJgLLbuNBJ4tzTNWoKXO4tpFVLkPQ6dVGEWPHTAiz7jIDFRwugxrtEvMukLhnMiEtREFe_3z8GxMxNy5mppxbKMotm58ZebDjFucUGt5E52N8az51m0yyCZdHVGiSn8vX5kWRyYnyneZ26loXHaw2mJMcXx_asYjDm6A-3rfL9e6wrp7aQWHSTn8lDLVQKUYxLhUtXfhE7X8FP4pQ_Rrol7GC_S70QWSEnDPo2-u5imhZy8',
    bg: 'bg-tertiary-container/30',
    border: 'border-tertiary-container'
  },
  {
    id: 'fox',
    name: 'Shadow Fox',
    hp: 500,
    xp: 250,
    coins: 100,
    stars: 4,
    reqLevel: 3,
    reqMob: 'bunny',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD89iErKXgkzCSSgE-9O3b3VvxXySVqEy2jdq9XjKs5CdYkcjBfoJWqtiVUwjl-ufAQm17eNtlKtBl0lrKJDpjdyV4uWwUcVMOQN2UxfYyk26AKPLnXb98J7r5hvXjkx3_LFpdHg6b1ACOKYuYS0qJVG_NBsghLgS12Qfsc4QF4d8N_oI1ZZGPQZaMoXCoMpZDuBdp-vBFym68NaR5QHHzQBmwi-CJxGm6p8R7s37geqqbU7uEPP2ocTRhzCz9XfTuVvG2nWveUBmk',
    bg: 'bg-secondary-container/30',
    border: 'border-secondary-container'
  }
];

export function AdversariesScreen() {
  const { xp, coins, equippedCompanionId, handleBattleResult, defeatedAdversaries, level } = useAppContext();
  const currentCompanion = COMPANIONS.find(c => c.id === equippedCompanionId) || COMPANIONS[0];
  
  const [activeQuiz, setActiveQuiz] = useState<number | null>(null);
  const [adversaryId, setAdversaryId] = useState<string | null>(null);
  const [quizResult, setQuizResult] = useState<'success' | 'fail' | null>(null);

  const startBattle = (id: string) => {
    setAdversaryId(id);
    setActiveQuiz(Math.floor(Math.random() * QUIZZES.length));
    setQuizResult(null);
  };

  const answerQuiz = (option: string) => {
    if (activeQuiz !== null && QUIZZES[activeQuiz].answer === option) {
      setQuizResult('success');
      setTimeout(() => {
        if (adversaryId) handleBattleResult(adversaryId, true);
        setActiveQuiz(null);
        setAdversaryId(null);
      }, 1500);
    } else {
      setQuizResult('fail');
      setTimeout(() => {
        if (adversaryId) handleBattleResult(adversaryId, false);
        setActiveQuiz(null);
        setAdversaryId(null);
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen pb-32">
      <Header title="Battles" />

      <main className="max-w-2xl mx-auto px-container-padding mt-stack-md">
        <h2 className="font-headline-xl text-[32px] text-primary font-bold mb-2 text-center">Bad Habit Battles</h2>
        <p className="text-center font-body-sm text-[14px] text-on-surface-variant mb-stack-lg max-w-sm mx-auto">Play fun quizzes to defeat bad habits and win extra coins!</p>
        
        <div className="space-y-stack-md">
          {ADVERSARIES.map((adv) => {
            const isDefeated = defeatedAdversaries.includes(adv.id);
            const isLocked = adv.reqMob && !defeatedAdversaries.includes(adv.reqMob) && level < adv.reqLevel;

            return (
              <div key={adv.id} className={`glass-card rounded-[24px] p-stack-md shadow-warm relative overflow-hidden group transition-all ${isDefeated ? 'border-green-500 border-2' : 'border border-white hover:scale-[1.02]'}`}>
                {isLocked && (
                  <div className="absolute inset-0 bg-surface/50 backdrop-blur-[2px] z-10 flex items-center justify-center">
                    <div className="bg-surface-container-highest px-4 py-2 rounded-full text-on-surface-variant font-ui-pixel-sm text-[10px] uppercase tracking-widest shadow-sm border border-outline-variant/30 font-bold whitespace-nowrap overflow-hidden text-ellipsis max-w-[90%]">
                      Defeat {ADVERSARIES.find(a => a.id === adv.reqMob)?.name || adv.reqMob} OR reach lvl {adv.reqLevel}
                    </div>
                  </div>
                )}
                <div className="flex gap-stack-md items-start">
                  <div className={`w-24 h-24 shrink-0 ${adv.bg} rounded-2xl flex items-center justify-center border-2 ${adv.border} shadow-inner relative text-[40px]`}>
                    {adv.isEmoji ? (
                      <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} className={isDefeated ? 'grayscale opacity-50' : ''}>
                        {adv.emoji}
                      </motion.div>
                    ) : (
                      <motion.img 
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        className={`w-16 h-16 ${isDefeated ? 'grayscale opacity-50' : ''}`} 
                        src={adv.image} 
                      />
                    )}
                    {isDefeated && <CheckCircle className="absolute inset-0 m-auto w-10 h-10 text-green-500 animate-pulse" />}
                  </div>
                  <div className="flex-1 w-full min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <div className="min-w-0 pr-2">
                        <h3 className="font-headline-lg text-[18px] text-primary font-bold truncate">{adv.name}</h3>
                        <div className="flex gap-0.5 text-secondary">
                          {Array.from({ length: adv.stars }).map((_, i) => (
                            <Sparkles key={i} className="w-3 h-3 fill-secondary" />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1 mb-3">
                      <div className="flex justify-between text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter">
                        <span>HP {isDefeated ? '0' : adv.hp}/{adv.hp}</span>
                      </div>
                      <div className="w-full h-3 bg-surface-container-highest rounded-sm p-[2px] border border-outline-variant/30">
                        <div className={`h-full ${isDefeated ? 'w-0' : 'w-full'} bg-error pixel-border-segmented rounded-sm transition-all duration-1000`}></div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-2 flex-wrap gap-2">
                      <div className="flex gap-2">
                        <div className="flex items-center gap-1 text-[12px] font-bold text-tertiary">
                          <Medal className="w-4 h-4" /> {adv.xp}
                        </div>
                        <div className="flex items-center gap-1 text-[12px] font-bold text-on-secondary-container">
                          <Coins className="w-4 h-4 text-orange-400" /> {adv.coins}
                        </div>
                      </div>
                      {!isDefeated && !isLocked && (
                        <button onClick={() => startBattle(adv.id)} className="bg-primary text-on-primary font-label-caps text-[10px] px-3 py-1.5 rounded-full shadow-[0_3px_0_#6a383d] active:translate-y-1 active:shadow-none transition-all uppercase tracking-widest font-bold shrink-0 flex items-center gap-1">
                          <Swords className="w-4 h-4" /> QUIZ BATTLE
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Quiz Modal overlay */}
      <AnimatePresence>
        {activeQuiz !== null && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-surface/80 backdrop-blur-md flex flex-col justify-center px-4"
          >
            <div className="bg-background max-w-sm w-full mx-auto rounded-[32px] shadow-2xl overflow-hidden shadow-[0_10px_40px_rgba(133,79,84,0.3)] border border-primary-container relative">
              <div className="p-6 bg-primary-container text-on-primary-container flex justify-between items-start">
                <Brain className="w-8 h-8" />
                <button onClick={() => setActiveQuiz(null)} className="opacity-50 hover:opacity-100"><X /></button>
              </div>
              <div className="p-6">
                <h3 className="font-headline-lg font-bold text-[20px] mb-6 text-on-surface">
                  {QUIZZES[activeQuiz].question}
                </h3>
                <div className="space-y-3">
                  {QUIZZES[activeQuiz].options.map(option => (
                    <button 
                      key={option}
                      className={`w-full p-4 rounded-xl font-bold transition-all ${
                        quizResult === null ? 'bg-surface-container-low hover:bg-primary-container text-on-surface hover:text-primary active:scale-95' : 
                        quizResult === 'success' && option === QUIZZES[activeQuiz].answer ? 'bg-green-500 text-white' : 
                        quizResult === 'fail' && option !== QUIZZES[activeQuiz].answer ? 'bg-error text-white' : 'opacity-50'
                      }`}
                      onClick={() => !quizResult && answerQuiz(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                {quizResult === 'success' && <p className="mt-4 text-center font-bold text-green-500 animate-pulse">Correct! You deal huge DMG!</p>}
                {quizResult === 'fail' && <p className="mt-4 text-center font-bold text-error animate-pulse">Incorrect! Try again later!</p>}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
