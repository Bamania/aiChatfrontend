import { Conversation } from '../feature/types';

// Current date for realistic timestamps
const now = new Date();

const hoursAgo = (hours: number) => new Date(now.getTime() - hours * 60 * 60000);

export const conversations: Conversation[] = [

  {
    id: '6',
    name: 'Nikola Tesla',
    avatarColor: 'bg-yellow-600',
    preview: 'I placed the order over 60 days ago 🙃. Could you make an exception, please?',
    lastMessageTime: '21m',
    messages: [
      {
        id: 'msg1',
        content: 'I bought a product from your store in November as a Christmas gift for a member of my family. However, it turns out they have something very similar already. I was hoping you\'d be able to refund me, as it is un-opened.',
        sender: 'user',
        timestamp: hoursAgo(1),
      },
    
    ],
    waitingNotice: 'This customer has been waiting for 5 minutes.'
  }
];

export const activeConversation = conversations[0]; // Nikola Tesla conversation