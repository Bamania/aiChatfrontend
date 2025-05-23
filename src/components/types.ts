export interface AIResponse {
  suggestions?: string[];
  content?: string;
  status?: string;
}

// Define a proper Conversation type
export interface Conversation {
  id: string;
  title?: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  status?: 'active' | 'archived';
}

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