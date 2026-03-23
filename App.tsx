
import React, { useState, useEffect } from 'react';
import { AppLanguage, AppScreen, UserStats, UserRole, DifficultyLevel } from './types';
import ChatSection from './components/ChatSection';
import QuestSection from './components/QuestSection';
import NewsSection from './components/NewsSection';
import PosterSection from './components/PosterSection';
import HomeSection from './components/HomeSection';
import StatsSection from './components/StatsSection';
import ScenarioSection from './components/ScenarioSection';
import QuizSection from './components/QuizSection';
import LearnSection from './components/LearnSection';

const App: React.FC = () => {
  const [language, setLanguage] = useState<AppLanguage>(AppLanguage.ENGLISH);
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(AppScreen.HOME);
  const [stats, setStats] = useState<UserStats>({
    points: 0,
    level: 1,
    badges: [],
    completedQuizzes: 0,
    role: UserRole.STUDENT,
    rank: DifficultyLevel.RECRUIT,
    completedPathSteps: [],
    completedOps: [],
    chestsOwned: 1,
    dailyHistory: {},
    hearts: 5,
    streak: 0,
    lastActive: ''
  });

  useEffect(() => {
    const savedStats = localStorage.getItem('cyberRaksha_v5_duo');
    if (savedStats) {
      const parsed = JSON.parse(savedStats);
      const today = new Date().toISOString().split('T')[0];
      
      // Calculate Streak
      let newStreak = parsed.streak || 0;
      if (parsed.lastActive) {
        const lastDate = new Date(parsed.lastActive);
        const currentDate = new Date(today);
        const diff = (currentDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24);
        
        if (diff === 1) {
          // Keep streak going
        } else if (diff > 1) {
          newStreak = 0; // Lost streak
        }
      }

      setStats({
        ...parsed,
        completedOps: parsed.completedOps || [],
        streak: newStreak,
        lastActive: parsed.lastActive || ''
      });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cyberRaksha_v5_duo', JSON.stringify(stats));
  }, [stats]);

  const recordPoints = (amount: number) => {
    const today = new Date().toISOString().split('T')[0];
    setStats(prev => {
      const newPoints = prev.points + amount;
      const history = { ...prev.dailyHistory };
      history[today] = (history[today] || 0) + amount;
      
      let newStreak = prev.streak;
      if (prev.lastActive !== today) {
        newStreak += 1;
      }

      const newLevel = Math.floor(newPoints / 1000) + 1;
      return { 
        ...prev, 
        points: newPoints, 
        level: newLevel, 
        dailyHistory: history,
        lastActive: today,
        streak: newStreak
      };
    });
  };

  const recordOpComplete = (opId: string, pts: number) => {
    recordPoints(pts);
    setStats(prev => ({
      ...prev,
      completedOps: [...prev.completedOps, opId]
    }));
  };

  const loseHeart = () => {
    setStats(prev => ({
      ...prev,
      hearts: Math.max(0, prev.hearts - 1)
    }));
  };

  const regainHearts = () => {
    setStats(prev => ({
      ...prev,
      hearts: 5,
      points: Math.max(0, prev.points - 200) 
    }));
  };

  const openChest = () => {
    if (stats.chestsOwned > 0) {
      const reward = Math.floor(Math.random() * 500) + 100;
      recordPoints(reward);
      setStats(prev => ({ ...prev, chestsOwned: prev.chestsOwned - 1 }));
      return reward;
    }
    return undefined;
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case AppScreen.HOME: return <HomeSection language={language} setScreen={setCurrentScreen} stats={stats} openChest={openChest} onRegainHearts={regainHearts} />;
      case AppScreen.CHAT: return <ChatSection language={language} />;
      case AppScreen.QUESTS: return <QuestSection language={language} currentRank={stats.rank} completedOps={stats.completedOps} onOpWin={recordOpComplete} onLoseHeart={loseHeart} hearts={stats.hearts} />;
      case AppScreen.STATS: return <StatsSection stats={stats} />;
      case AppScreen.LEARN: return <LearnSection language={language} completedSteps={stats.completedPathSteps} onStepComplete={(id) => { recordPoints(100); setStats(prev => ({...prev, completedPathSteps: [...prev.completedPathSteps, id]})); }} onLoseHeart={loseHeart} hearts={stats.hearts} />;
      case AppScreen.NEWS: return <NewsSection language={language} />;
      case AppScreen.QUIZ: return <QuizSection language={language} onComplete={(pts) => recordPoints(pts)} />;
      case AppScreen.SCENARIO: return <ScenarioSection language={language} onWin={(pts) => recordPoints(pts)} />;
      case AppScreen.POSTER: return <PosterSection language={language} />;
      default: return <HomeSection language={language} setScreen={setCurrentScreen} stats={stats} openChest={openChest} onRegainHearts={regainHearts} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-slate-950 shadow-2xl relative overflow-hidden text-white border-x-4 border-black">
      <header className="bg-black border-b-4 border-black p-4 sticky top-0 z-50 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded-lg border-2 border-black toon-card">
            <span className="text-red-500 text-xs"><i className="fas fa-heart"></i></span>
            <span className="text-[10px] font-black">{stats.hearts}</span>
          </div>
          <div className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded-lg border-2 border-black toon-card">
            <span className="text-orange-500 text-xs"><i className="fas fa-fire"></i></span>
            <span className="text-[10px] font-black">{stats.streak}</span>
          </div>
        </div>
        
        <h1 className="font-black text-xs tracking-widest uppercase glitch-text">CyberRaksha</h1>

        <button 
          onClick={() => setLanguage(l => l === AppLanguage.ENGLISH ? AppLanguage.TAMIL : AppLanguage.ENGLISH)}
          className="bg-black text-white px-2 py-1 text-[8px] font-black border-2 border-white rounded toon-card active:bg-white active:text-black transition-all"
        >
          {language === AppLanguage.ENGLISH ? 'TAMIL' : 'ENGLISH'}
        </button>
      </header>

      <main className="flex-grow p-4 overflow-y-auto pb-24 no-scrollbar">
        {renderScreen()}
      </main>

      <nav className="bg-black border-t-4 border-black fixed bottom-0 w-full max-w-md flex justify-around p-3 z-50">
        <NavButton active={currentScreen === AppScreen.HOME} onClick={() => setCurrentScreen(AppScreen.HOME)} icon="fa-house" label="HQ" />
        <NavButton active={currentScreen === AppScreen.LEARN} onClick={() => setCurrentScreen(AppScreen.LEARN)} icon="fa-road" label="PATH" />
        <NavButton active={currentScreen === AppScreen.QUESTS} onClick={() => setCurrentScreen(AppScreen.QUESTS)} icon="fa-crosshairs" label="OPS" />
        <NavButton active={currentScreen === AppScreen.NEWS} onClick={() => setCurrentScreen(AppScreen.NEWS)} icon="fa-satellite-dish" label="INTEL" />
        <NavButton active={currentScreen === AppScreen.STATS} onClick={() => setCurrentScreen(AppScreen.STATS)} icon="fa-user-ninja" label="ID" />
      </nav>
    </div>
  );
};

const NavButton = ({ active, onClick, icon, label }: any) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1 transition-all ${active ? 'text-cyan-400 scale-110' : 'text-slate-600'}`}>
    <i className={`fas ${icon} text-lg`}></i>
    <span className="text-[8px] font-black tracking-widest">{label}</span>
  </button>
);

export default App;
