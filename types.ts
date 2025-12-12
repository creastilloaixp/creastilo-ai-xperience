
export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export enum ToolType {
  Roulette = 'roulette',
  Avatar = 'avatar',
  CRM = 'crm',
  Custom = 'custom',
  GenAI = 'genai',
  Neural = 'neural' // New Module
}

export enum GenAITool {
  Copywriter = 'copywriter',
  ImageSynth = 'image',
  Voice = 'voice',
  SmartEditor = 'editor'
}

export interface NavItem {
  label: string;
  href: string;
}