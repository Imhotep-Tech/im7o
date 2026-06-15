export interface Entity {
  id: string;
  name: string;
  score: number;
  isEliminated: boolean;
}

export interface GameConfig {
  id: string;
  mode: string;
  title: string;
  hasTimer: boolean;
  defaultTimerSeconds?: number;
  isTimerCustomizable?: boolean;
  allowElimination: boolean;
  themeColor: string;
  logo: string;
  instructions: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cards: any[];
  turnStrategy?: "sequential" | "open";
  allowPass?: boolean;
  author?: string;
}

export interface GameProps {
  config: GameConfig;
}

export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}
