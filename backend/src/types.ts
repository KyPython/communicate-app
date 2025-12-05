export interface Channel {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
}

export interface Message {
  id: string;
  channelId: string;
  author: string;
  text: string;
  createdAt: Date;
  parentId?: string; // For threaded replies
}

export interface CreateChannelRequest {
  name: string;
  description: string;
}

export interface CreateMessageRequest {
  author: string;
  text: string;
  parentId?: string;
}

