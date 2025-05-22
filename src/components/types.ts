import { Conversation } from "@/feature/types";

export interface ChatWindowProps {
  conversation: Conversation;
  initialContent?:string
  onToggleSidebar: () => void;
}
export interface ConversationListProps {
  conversations: Conversation[];
  activeId: string;
  onSelectConversation: (id: string) => void;
}

export interface DetailsSidebarProps {
  conversation: Conversation;
  initialContent?:string
  onAddToComposer?: (content: string) => void;
}
export interface AIResponse {
    suggestions?: string[];
    context?: string;
    // add other properties you expect from the server
  }
  export interface ChatBubbleResponse{
    content?:string
  }