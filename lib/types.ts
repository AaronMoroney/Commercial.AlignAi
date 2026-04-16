import grokIcon from "../public/grok.jpg";
import openaIicon from "../public/openai.jpg";
import geminiIcon from "../public/gemini.jpg";
import claudeIcon from "../public/claude.jpg";

export type ModelId = "chatgpt" | "claude" | "gemini" | "grok";

export interface Model {
  id: ModelId;
  name: string;
  model: string;
  provider: string;
  icon: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  responses?: Partial<Record<ModelId, string>>;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: Date;
  messages: Message[];
}

export const MODELS: Model[] = [
  { id: "chatgpt", name: "ChatGPT", provider: "OpenAI", model: 'GPT-5.4-nano', icon: openaIicon},
  { id: "claude", name: "Claude", provider: "Anthropic", model: 'GPT-5.4-nano', icon: claudeIcon },
  { id: "gemini", name: "Gemini", provider: "Google", model: 'GPT-5.4-nano', icon: geminiIcon },
  { id: "grok", name: "Grok", provider: "xAI", model: 'GPT-5.4-nano', icon: grokIcon},
];
