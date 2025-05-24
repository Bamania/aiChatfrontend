
import { Conversation } from '../feature/types';
export interface AIResponse {
  suggestions?: string[];
  content?: string;
  status?: string;
}

// Define a proper Conversation type

export interface DetailsSidebarProps {
  onAddToComposer?: (content: string) => void;
  conversation?: Conversation; // Changed from any to Conversation
}

export interface ChatWindowProps {
  conversation: Conversation; // Changed from any to Conversation
  onToggleSidebar: () => void;
  initialContent?: string;
}

export interface ConversationListProps {
  conversations: Conversation[]; // Changed from any[] to Conversation[]
  activeId: string;
  onSelectConversation: (id: string) => void;
}

export interface WebSocketMessage {
  type?: string;
  content?: string;
  sender?: string;
  timestamp?: string;
  id?: string;
}