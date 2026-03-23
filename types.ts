
export enum AppLanguage {
  ENGLISH = 'English',
  TAMIL = 'Tamil'
}

export enum AppScreen {
  HOME = 'home',
  CHAT = 'chat',
  QUESTS = 'quests',
  NEWS = 'news',
  POSTER = 'poster',
  STATS = 'stats',
  SCENARIO = 'scenario',
  QUIZ = 'quiz',
  LEARN = 'learn'
}

export enum UserRole {
  STUDENT = 'Student',
  INSTRUCTOR = 'Instructor',
  ADMIN = 'Admin'
}

export enum DifficultyLevel {
  RECRUIT = 'Recruit',
  AGENT = 'Agent',
  SPECIALIST = 'Specialist',
  GHOST = 'Ghost'
}

export interface UserStats {
  points: number;
  level: number;
  badges: string[];
  completedQuizzes: number;
  role: UserRole;
  rank: DifficultyLevel;
  completedPathSteps: string[];
  completedOps: string[];
  chestsOwned: number;
  dailyHistory: Record<string, number>;
  hearts: number;
  streak: number;
  lastActive: string; // YYYY-MM-DD
}

export interface BlogSection {
  title: string;
  subTitle?: string;
  content: string;
  bullets?: string[];
  type: 'narrative' | 'technical' | 'case-study' | 'summary';
  codeSnippet?: string;
  language?: string;
}

export interface ResourceLink {
  title: string;
  url: string;
  type: 'video' | 'article';
  platform?: string;
}

export type GameType = 'logic-breach' | 'forensics' | 'signal-sort' | 'matching';

export interface LevelGame {
  type: GameType;
  instructions: string;
  data: any; 
}

export interface RoadmapStep {
  id: string;
  domainId: string;
  title: string;
  briefing: string;
  blogSections: BlogSection[];
  resources: ResourceLink[];
  game: LevelGame;
  style: 'high-sec' | 'deep-web' | 'terminal';
}

export interface CaseFile {
  id: string;
  title: string;
  difficulty: DifficultyLevel;
  objective: string;
  rewards: number;
  briefing: string;
  gameData: LevelGame;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  sourceUrl: string;
  severity: 'low' | 'medium' | 'high';
}

export interface Scenario {
  title: string;
  situation: string;
  options: { text: string; isSafe: boolean; explanation: string; }[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface AwarenessPoster {
  title: string;
  slogan: string;
  message: string;
  topic: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
