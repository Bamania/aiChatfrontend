import { Conversation } from '../feature/types';

// Current date for realistic timestamps
const now = new Date();
const minutesAgo = (mins: number) => new Date(now.getTime() - mins * 60000);
const hoursAgo = (hours: number) => new Date(now.getTime() - hours * 60 * 60000);

export const conversations: Conversation[] = [
  {
    id: '1',
    name: 'Luis',
    avatarColor: 'bg-blue-500',
    source: 'Github',
    preview: 'Hey! I have a questio...',
    lastMessageTime: '45m',
    isOnline: true,
    messages: [
      {
        id: 'msg1',
        content: 'Hey! I have a question about the API documentation. I\'m trying to integrate your service but I can\'t find the endpoint for user authentication.',
        sender: 'user',
        timestamp: hoursAgo(1),
      },
      {
        id: 'msg2',
        content: 'Let me just look into this for you, Luis.',
        sender: 'agent',
        timestamp: minutesAgo(45),
        status: 'seen'
      }
    ],
    waitingNotice: undefined
  },
  {
    id: '2',
    name: 'Ivan',
    avatarColor: 'bg-red-500',
    source: 'Nike',
    preview: 'Hi there, I have a qu...',
    lastMessageTime: '30m',
    priority: 'high',
    waitTime: '3min',
    messages: [
      {
        id: 'msg1',
        content: 'Hi there, I have a question about my recent order #12345. It says it was delivered, but I haven\'t received it yet.',
        sender: 'user',
        timestamp: hoursAgo(2),
      },
      {
        id: 'msg2',
        content: 'I\'m sorry to hear that. Let me check the status of your order right away.',
        sender: 'agent',
        timestamp: hoursAgo(1.5),
        status: 'seen'
      },
      {
        id: 'msg3',
        content: 'Any updates? It\'s been over 5 days since the supposed delivery date.',
        sender: 'user',
        timestamp: minutesAgo(33),
      }
    ],
    waitingNotice: undefined
  },
  {
    id: '3',
    name: 'Lead from New York',
    avatarColor: 'bg-green-500',
    preview: 'Good morning, let me...',
    lastMessageTime: '43m',
    messages: [
      {
        id: 'msg1',
        content: 'Good morning, I\'m interested in your enterprise plan. Could you provide more details about the pricing?',
        sender: 'user',
        timestamp: hoursAgo(3),
      },
      {
        id: 'msg2',
        content: 'Good morning! I\'d be happy to help with information about our enterprise plan. The pricing starts at $499/month for up to 10 users, with additional features like advanced analytics, dedicated support, and custom integrations.',
        sender: 'agent',
        timestamp: hoursAgo(2.5),
        status: 'seen'
      }
    ],
    waitingNotice: undefined
  },
  {
    id: '4',
    name: 'Booking API problems',
    avatarColor: 'bg-gray-800',
    preview: 'Bug report',
    lastMessageTime: '46m',
    messages: [
      {
        id: 'msg1',
        content: 'We\'re experiencing issues with the booking API. Requests are timing out after 30 seconds and returning 504 errors.',
        sender: 'user',
        timestamp: hoursAgo(5),
      },
      {
        id: 'msg2',
        content: 'I\'ll escalate this to our engineering team right away. Could you provide the request IDs of some failed attempts?',
        sender: 'agent',
        timestamp: hoursAgo(4.5),
        status: 'seen'
      }
    ],
    waitingNotice: undefined
  },
  {
    id: '5',
    name: 'Miracle',
    avatarColor: 'bg-purple-500',
    source: 'Exemplary Bank',
    preview: 'Hey there, I\'m here to...',
    lastMessageTime: '46m',
    messages: [
      {
        id: 'msg1',
        content: 'Hey there, I\'m having trouble resetting my password. The reset email never arrives.',
        sender: 'user',
        timestamp: hoursAgo(6),
      },
      {
        id: 'msg2',
        content: 'I\'m sorry to hear you\'re having trouble. Let me check if there are any issues with our email delivery system.',
        sender: 'agent',
        timestamp: hoursAgo(5.5),
        status: 'seen'
      }
    ],
    waitingNotice: undefined
  },
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

export const activeConversation = conversations[5]; // Nikola Tesla conversation