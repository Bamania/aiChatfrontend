import { Conversation } from "@/feature/types";

export interface AIResponse {
  suggestions?: string[];
  content?: string;
  status?: string;
}

export interface DetailsSidebarProps {
  onAddToComposer?: (content: string) => void;
  conversation?: any; // You might want to define a proper Conversation type
}

export interface ChatWindowProps {
  conversation: any; // Define proper Conversation type
  onToggleSidebar: () => void;
  initialContent?: string;
}

export interface ConversationListProps {
  conversations: any[]; // Define proper Conversation array type
  activeId: string;
  onSelectConversation: (id: string) => void;
}

export interface WebSocketMessage {
  type?: string;
  content?: string;
  data?: unknown;
  [key: string]: unknown;
}

// Add other interfaces as needed
export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  status?: 'sent' | 'seen';
}