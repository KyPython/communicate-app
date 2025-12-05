import { Channel, Message } from './types';

// In-memory storage
class Store {
  private channels: Map<string, Channel> = new Map();
  private messages: Map<string, Message> = new Map();
  private channelMessages: Map<string, string[]> = new Map(); // channelId -> messageIds[]

  // Channel operations
  addChannel(channel: Channel): void {
    this.channels.set(channel.id, channel);
    this.channelMessages.set(channel.id, []);
  }

  getChannel(id: string): Channel | undefined {
    return this.channels.get(id);
  }

  getAllChannels(): Channel[] {
    return Array.from(this.channels.values());
  }

  // Message operations
  addMessage(message: Message): void {
    this.messages.set(message.id, message);
    const channelMessages = this.channelMessages.get(message.channelId) || [];
    channelMessages.push(message.id);
    this.channelMessages.set(message.channelId, channelMessages);
  }

  getMessage(id: string): Message | undefined {
    return this.messages.get(id);
  }

  getMessagesByChannel(channelId: string): Message[] {
    const messageIds = this.channelMessages.get(channelId) || [];
    return messageIds
      .map(id => this.messages.get(id))
      .filter((msg): msg is Message => msg !== undefined)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  getReplies(parentId: string): Message[] {
    return Array.from(this.messages.values())
      .filter(msg => msg.parentId === parentId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }
}

export const store = new Store();

