export const empirePersonalities = [
  'megalomaniacal',
  'erratic',
  'passive',
  'friendly',
  'greedy',
  'selfish',
  'reclusive',
] as const;

export type EmpirePersonality = (typeof empirePersonalities)[number];

export type Empire = {
  empireName: string;
  capitalName: string;
  rulerName: string;
  regionalStrength: number;
  playerReputation: number;
  messageHistory: Message[];
  personality: EmpirePersonality;
  color: number;
};

export type Message = {
  message: string;
  sender: 'user' | 'empire' | 'system';
  timestamp: number;
};
