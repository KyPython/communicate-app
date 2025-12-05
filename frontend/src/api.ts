import type { Channel, Message, ThreadData } from './types';

const API_BASE_URL = 'http://localhost:3001';

export async function fetchChannels(): Promise<Channel[]> {
  const response = await fetch(`${API_BASE_URL}/channels`);
  if (!response.ok) {
    throw new Error('Failed to fetch channels');
  }
  return response.json();
}

export async function createChannel(name: string, description: string): Promise<Channel> {
  const response = await fetch(`${API_BASE_URL}/channels`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, description }),
  });
  if (!response.ok) {
    throw new Error('Failed to create channel');
  }
  return response.json();
}

export async function fetchMessages(channelId: string, includeReplies = false): Promise<Message[]> {
  const url = `${API_BASE_URL}/channels/${channelId}/messages${includeReplies ? '?includeReplies=true' : ''}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch messages');
  }
  return response.json();
}

export async function createMessage(
  channelId: string,
  author: string,
  text: string,
  parentId?: string
): Promise<Message> {
  const response = await fetch(`${API_BASE_URL}/channels/${channelId}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ author, text, parentId }),
  });
  if (!response.ok) {
    throw new Error('Failed to create message');
  }
  return response.json();
}

export async function fetchThread(messageId: string): Promise<ThreadData> {
  const response = await fetch(`${API_BASE_URL}/messages/${messageId}/replies`);
  if (!response.ok) {
    throw new Error('Failed to fetch thread');
  }
  return response.json();
}

