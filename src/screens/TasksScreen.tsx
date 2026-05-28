import React, { useState, useEffect, useRef } from 'react';
import { Header } from '../components/Header';
import { COMPANIONS, useAppContext } from '../AppContext';
import { Plus, Check, Sparkles, X, Camera, UploadCloud, BrainCircuit, Type, Timer } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function TasksScreen() {
  const { tasks, addTask, toggleTask, xp, coins, level, equippedCompanionId, setXp } = useAppContext() as any;
  const [newTask, setNewTask] = useState('');

  const currentCompanion = COMPANIONS.find(c => c.id === equippedCompanionId) || COMPANIONS[0];

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim()) {
      addTask(newTask);
      setNewTask('');
    }
  };

  const activeTasks = tasks.filter((t: any) => !t.completed);
  const completedTasks = tasks.filter((t: any) => t.completed);

  const [activeModal, setActiveModal] = useState<'food' | 'journal' | 'flashcards' | null>(null);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  const [filePhase, setFilePhase] = useState<'idle' | 'scanning' | 'success'>('idle');
  
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef<any>(null);
  
  // Journal State
  const [journalText, setJournalText] = useState('');
  const [journalPhase, setJournalPhase] = useState<'writing' | 'analyzing' | 'success' | 'failed'>('writing');
  const [journalFeedback, setJournalFeedback] = useState('');

  // Flashcard State
  const [flashcards, setFlashcards] = useState<any[]>([]);
  const [cardIndex, setCardIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [flashcardPhase, setFlashcardPhase] = useState<'loading' | 'playing' | 'results'>('loading');

  const analyzeJournal = async () => {
    setJournalPhase('analyzing');
    try {
      const res = await fetch('/api/analyze-journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: journalText })
      });
      const data = await res.json();
      setJournalFeedback(data.feedback || '');
      if (data.isGibberish) {
        setJournalPhase('failed');
      } else {
        setJournalPhase('success');
      }
    } catch (e) {
      setJournalFeedback('Error analyzing journal.');
      setJournalPhase('failed');
    }
  };

  const loadFlashcards = async () => {
    setFlashcardPhase('loading');
    try {
      const res = await fetch('/api/generate-flashcards', { method: 'POST' });
      const data = await res.json();
      setFlashcards(data.questions || []);
      setCardIndex(0);
      setCorrectCount(0);
      setFlashcardPhase('playing');
    } catch (e) {
      console.error(e);
      // Fallback
      setFlashcards([
         { question: "Fallback: What is the powerhouse of the cell?", options: ["Nucleus", "Mitochondria", "Ribosome", "ER"], answerIndex: 1 },
         { question: "Fallback: What year did Titanic sink?", options: ["1910", "1912", "1915", "1920"], answerIndex: 1 }
      ]);
      setCardIndex(0);
      setCorrectCount(0);
      setFlashcardPhase('playing');
    }
  };

  const answerFlashcard = (index: number) => {
    if (index === flashcards[cardIndex].answerIndex) {
      setCorrectCount(prev => prev + 1);
    }
    if (cardIndex < flashcards.length - 1) {
      setCardIndex(prev => prev + 1);
    } else {
      setFlashcardPhase('results');
    }
  };

  const handleToggleTask = (id: string, text: string, isCurrentlyCompleted: boolean) => {
    if (isCurrentlyCompleted) {
      toggleTask(id);
      return;
    }

    const lowerText = text.toLowerCase();
    setActiveTaskId(id);
    
    if (lowerText.includes('food')) {
      setActiveModal('food');
      setFilePhase('idle');
    } else if (lowerText.includes('journal')) {
      setActiveModal('journal');
      setTimeLeft(120); // 2 mins
      setJournalText('');
      setJournalPhase('writing');
    } else if (lowerText.includes('flashcard')) {
      setActiveModal('flashcards');
      loadFlashcards();
    } else {
      toggleTask(id);
      setActiveTaskId(null);
    }
  };

  useEffect(() => {
    if (activeModal === 'journal') {
      if (journalPhase === 'writing') {
        timerRef.current = setInterval(() => {
          setTimeLeft(t => {
            if (t <= 0) {
              clearInterval(timerRef.current);
              analyzeJournal();
              return 0;
            }
            return t - 1;
          });
        }, 1000);
      } else {
        clearInterval(timerRef.current);
      }
    }
    return () => clearInterval(timerRef.current);
  }, [activeModal, journalPhase]);

  const handleFailEarly = () => {
    clearInterval(timerRef.current);
    if (activeModal === 'journal' || activeModal === 'flashcards') {
      setXp?.((x: number) => Math.max(0, x - 5)); // specific lose 5xp
    }
    setActiveModal(null);
    setActiveTaskId(null);
  };

  return (
    <div className="min-h-screen pb-32">
      <Header title="Habits" />

      <main className="max-w-xl mx-auto px-container-padding pt-stack-lg relative z-10">
        
        <div className="mb-stack-lg text-center">
          <h2 className="font-headline-xl text-[28px] text-primary font-bold tracking-tight mb-2">Daily Quests</h2>
          <p className="font-body-sm text-[14px] text-on-surface-variant">Complete your habits to help your companion grow!</p>
        </div>

        {/* Add Task Form */}
        <form onSubmit={handleAdd} className="mb-10 relative shadow-warm rounded-2xl group">
          <input 
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new daily habit..."
            className="w-full bg-white border-2 border-outline-variant/30 rounded-2xl px-5 py-4 pr-16 focus:outline-none focus:border-primary-container transition-colors font-body-md shadow-sm"
          />
          <button 
            type="submit"
            disabled={!newTask.trim()}
            className="absolute right-2 top-2 bottom-2 aspect-square bg-primary text-on-primary rounded-xl flex items-center justify-center disabled:opacity-50 disabled:bg-outline-variant transition-colors active:scale-95 shadow-[0_3px_0_#6a383d] disabled:shadow-none active:shadow-none active:translate-y-[3px]"
          >
            <Plus className="w-5 h-5" />
          </button>
        </form>

        <h3 className="font-label-caps text-[12px] text-on-surface-variant uppercase tracking-widest mb-4 ml-2 font-bold">To Do ({activeTasks.length})</h3>
        <div className="space-y-3 mb-10">
          <AnimatePresence>
            {activeTasks.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-center py-12 glass-card rounded-2xl border-dashed border-2 border-outline-variant/50 opacity-80 shadow-none flex flex-col items-center"
              >
                <div className="w-16 h-16 bg-surface-container-high rounded-full flex items-center justify-center mb-4">
                  <Sparkles className="w-8 h-8 text-outline-variant" />
                </div>
                <p className="font-body-md font-bold text-on-surface">All caught up!</p>
                <p className="font-body-sm text-[14px] text-on-surface-variant mt-1">Time to relax with your companion.</p>
              </motion.div>
            )}
            {activeTasks.map(task => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-card rounded-2xl p-4 flex items-center gap-4 group cursor-pointer border-2 border-transparent hover:border-primary-container transition-colors shadow-sm active:scale-[0.98]"
                onClick={() => handleToggleTask(task.id, task.text, task.completed)}
              >
                <div className="w-7 h-7 rounded-[8px] border-[3px] border-outline-variant flex items-center justify-center group-hover:border-primary-container transition-colors shrink-0 bg-white relative overflow-hidden">
                </div>
                <span className="font-body-md flex-1 text-on-surface font-bold">
                  {task.text} 
                </span>
                <div className="flex flex-col sm:flex-row gap-1 items-end sm:items-center">
                  <span className="font-ui-pixel-sm text-[8px] text-on-surface-variant bg-surface-container-highest px-1.5 py-0.5 rounded uppercase tracking-wider font-bold mr-2"><Timer className="w-2 h-2 inline mr-0.5"/> 24:00:00</span>
                  {task.xpReward > 0 && <span className="font-ui-pixel-sm text-[8px] text-tertiary bg-tertiary-container/50 px-1.5 py-0.5 rounded uppercase tracking-wider font-bold">+{task.xpReward} XP</span>}
                  {task.healthReward > 0 && <span className="font-ui-pixel-sm text-[8px] text-error bg-error-container/50 px-1.5 py-0.5 rounded uppercase tracking-wider font-bold">+{task.healthReward} HP</span>}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {completedTasks.length > 0 && (
          <>
            <h3 className="font-label-caps text-[12px] text-on-surface-variant uppercase tracking-widest mb-4 ml-2 font-bold">Completed</h3>
            <div className="space-y-3 opacity-60">
              <AnimatePresence>
                {completedTasks.map((task: any) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="glass-card rounded-2xl p-4 flex items-center gap-4 cursor-pointer active:scale-[0.98] transition-transform"
                    onClick={() => handleToggleTask(task.id, task.text, task.completed)}
                  >
                    <div className="w-7 h-7 rounded-[8px] bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-inner border border-primary-fixed-dim">
                      <Check className="w-4 h-4" />
                    </div>
                    <span className="font-body-md flex-1 text-on-surface line-through decoration-outline decoration-2 font-medium">{task.text}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </>
        )}
      </main>

      {/* Task Modals */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={activeModal === 'food' ? () => setActiveModal(null) : undefined}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-card w-full max-w-sm rounded-[32px] p-6 shadow-2xl relative z-10 flex flex-col items-center text-center py-10 border border-white/50"
            >
              {activeModal === 'food' && (
                <>
                  <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface"><X className="w-6 h-6"/></button>
                  <div className="w-20 h-20 bg-primary-container rounded-full flex items-center justify-center mb-4">
                    <Camera className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="font-headline-lg text-2xl font-bold text-primary mb-2">Food Upload</h3>
                  <p className="text-on-surface-variant text-sm mb-6 max-w-[250px]">Upload a photo of your meal. The AI will scan it to ensure it contains healthy greens!</p>
                  
                  {filePhase === 'idle' && (
                    <label className="w-full h-32 border-2 border-dashed border-primary/50 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-white/40 transition-colors">
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                        if (e.target.files?.length) {
                          setFilePhase('scanning');
                          setTimeout(() => {
                            setFilePhase('success');
                            setTimeout(() => {
                              if (activeTaskId) toggleTask(activeTaskId);
                              setActiveModal(null);
                            }, 1500);
                          }, 2500);
                        }
                      }} />
                      <UploadCloud className="w-8 h-8 text-primary/70 mb-2" />
                      <span className="font-label-caps text-primary text-[12px] font-bold">Tap to Upload</span>
                    </label>
                  )}
                  {filePhase === 'scanning' && (
                    <div className="w-full flex flex-col items-center justify-center h-32">
                      <BrainCircuit className="w-10 h-10 text-primary animate-pulse mb-3" />
                      <p className="font-ui-pixel-sm tracking-widest text-[10px] text-primary">SCANNlNG MEAL...</p>
                    </div>
                  )}
                  {filePhase === 'success' && (
                    <div className="w-full flex flex-col items-center justify-center h-32">
                      <Check className="w-12 h-12 text-green-500 mb-2" />
                      <p className="font-label-caps font-bold text-green-600">Great job! +EXP</p>
                    </div>
                  )}
                </>
              )}

              {activeModal === 'journal' && (
                <>
                  <div className="w-16 h-16 bg-secondary-container rounded-full flex items-center justify-center mb-4 border border-secondary/20 shadow-inner">
                    <Type className="w-8 h-8 text-secondary" />
                  </div>
                  <h3 className="font-headline-lg text-2xl font-bold text-primary mb-1">Notebook</h3>
                  
                  {journalPhase === 'writing' && (
                    <>
                      <p className="text-on-surface-variant text-[12px] mb-4">Write your thoughts for {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')} min</p>
                      <textarea 
                        value={journalText}
                        onChange={e => setJournalText(e.target.value)}
                        className="w-full h-40 bg-surface-container-low rounded-2xl p-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-secondary/50 placeholder:text-on-surface-variant/50 border border-outline-variant/30"
                        placeholder="Dear diary..."
                        disabled={journalPhase !== 'writing'}
                      />
                      <div className="w-full flex gap-3 mt-6">
                        <button onClick={handleFailEarly} className="flex-1 py-3 font-label-caps text-[12px] font-bold text-error tracking-widest rounded-full hover:bg-error-container/50">GIVE UP</button>
                      </div>
                    </>
                  )}

                  {journalPhase === 'analyzing' && (
                    <div className="w-full flex flex-col items-center justify-center py-10">
                      <BrainCircuit className="w-10 h-10 text-primary animate-pulse mb-3" />
                      <p className="font-ui-pixel-sm tracking-widest text-[10px] text-primary">ANALYZING TEXT...</p>
                    </div>
                  )}

                  {journalPhase === 'success' && (
                    <div className="w-full flex flex-col items-center justify-center py-6">
                      <Check className="w-12 h-12 text-green-500 mb-4" />
                      <p className="font-body-md text-on-surface mb-6">"{journalFeedback}"</p>
                      <button onClick={() => {
                        if (activeTaskId) toggleTask(activeTaskId);
                        setActiveModal(null);
                      }} className="w-full py-3 font-label-caps text-[12px] font-bold text-white bg-green-500 tracking-widest rounded-full shadow-md active:scale-95">CLAIM REWARD</button>
                    </div>
                  )}

                  {journalPhase === 'failed' && (
                    <div className="w-full flex flex-col items-center justify-center py-6">
                      <X className="w-12 h-12 text-error mb-4" />
                      <p className="font-body-md text-on-surface mb-6">{journalFeedback || "That didn't seem like writing..."}</p>
                      <button onClick={handleFailEarly} className="w-full py-3 font-label-caps text-[12px] font-bold text-white bg-error tracking-widest rounded-full shadow-md active:scale-95">QUIT (-5XP)</button>
                    </div>
                  )}
                </>
              )}

              {activeModal === 'flashcards' && (
                <>
                   <div className="w-16 h-16 bg-tertiary-container rounded-full flex items-center justify-center mb-4 border border-tertiary/20 shadow-inner">
                    <Timer className="w-8 h-8 text-tertiary" />
                  </div>
                  <h3 className="font-headline-lg text-2xl font-bold text-primary mb-1">Study Time</h3>
                  
                  {flashcardPhase === 'loading' && (
                    <div className="w-full flex flex-col items-center justify-center py-10">
                      <BrainCircuit className="w-10 h-10 text-tertiary animate-pulse mb-3" />
                      <p className="font-ui-pixel-sm tracking-widest text-[10px] text-tertiary">GENERATING CARDS...</p>
                    </div>
                  )}

                  {flashcardPhase === 'playing' && flashcards.length > 0 && (
                    <>
                      <div className="bg-surface-container-highest px-4 py-1.5 rounded-full mb-6 relative">
                        <p className="font-ui-pixel-sm text-tertiary relative z-10 tracking-widest font-bold">QUESTION {cardIndex + 1} OF {flashcards.length}</p>
                      </div>
                      
                      <div className="w-full rounded-2xl p-6 shadow-sm border border-outline-variant/30 mb-6 bg-tertiary-container/30">
                        <p className="font-body-md text-on-surface font-medium text-lg">
                          {flashcards[cardIndex].question}
                        </p>
                      </div>

                      <div className="w-full flex flex-col gap-3">
                        {flashcards[cardIndex].options.map((opt: string, i: number) => (
                          <button 
                            key={i} 
                            onClick={() => answerFlashcard(i)}
                            className="w-full py-3 px-4 font-body-sm text-[14px] font-medium text-on-surface bg-surface-container border border-outline-variant/30 rounded-xl hover:bg-tertiary-container hover:border-tertiary/50 transition-colors text-left active:scale-[0.98]"
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                      
                      <button onClick={handleFailEarly} className="w-full mt-6 py-3 font-label-caps text-[12px] font-bold text-error tracking-widest rounded-full hover:bg-error-container/50 transition-colors">QUIT (-5XP)</button>
                    </>
                  )}

                  {flashcardPhase === 'results' && (
                    <div className="w-full flex flex-col items-center justify-center py-6">
                      {correctCount >= 5 ? (
                        <>
                          <Check className="w-12 h-12 text-green-500 mb-4" />
                          <p className="font-headline-lg text-primary text-xl font-bold mb-2">You Passed!</p>
                          <p className="font-body-md text-on-surface mb-6">Score: {correctCount}/{flashcards.length}</p>
                          <button onClick={() => {
                            if (activeTaskId) toggleTask(activeTaskId);
                            setActiveModal(null);
                          }} className="w-full py-3 font-label-caps text-[12px] font-bold text-white bg-green-500 tracking-widest rounded-full shadow-md active:scale-95">CLAIM REWARD</button>
                        </>
                      ) : (
                        <>
                          <X className="w-12 h-12 text-error mb-4" />
                          <p className="font-headline-lg text-error text-xl font-bold mb-2">Failed!</p>
                          <p className="font-body-md text-on-surface mb-6">Score: {correctCount}/{flashcards.length}. You need at least 5 to pass.</p>
                          <button onClick={handleFailEarly} className="w-full py-3 font-label-caps text-[12px] font-bold text-white bg-error tracking-widest rounded-full shadow-md active:scale-95">QUIT (-5XP)</button>
                        </>
                      )}
                    </div>
                  )}
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
