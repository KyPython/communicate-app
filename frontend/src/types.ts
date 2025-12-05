export interface Channel {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

export interface Message {
  id: string;
  channelId: string;
  author: string;
  text: string;
  createdAt: string;
  parentId?: string;
}

export interface ThreadData {
  parent: Message;
  replies: Message[];
}

