export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'agent' | 'system';
  timestamp: Date;
  status?: 'sent' | 'delivered' | 'seen';
}

export interface Conversation {
  id: string;
  name: string;
  avatar?: string;
  avatarColor: string;
  preview: string;
  lastMessageTime: string;
  isOnline?: boolean;
  source?: string;
  priority?: 'normal' | 'high';
  waitTime?: string;
  messages: Message[];
  waitingNotice?: string;
}
