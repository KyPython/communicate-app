import { useEffect, useState, useRef } from 'react';
import { fetchMessages, createMessage } from '../api';
import { useWebSocket } from '../hooks/useWebSocket';
import type { Message } from '../types';
import './MessageList.css';

interface MessageListProps {
  channelId: string | null;
  currentUser: string;
  onOpenThread: (messageId: string) => void;
}

export function MessageList({ channelId, currentUser, onOpenThread }: MessageListProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessageText, setNewMessageText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (channelId) {
      loadMessages();
    } else {
      setMessages([]);
    }
  }, [channelId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    if (!channelId) return;
    setIsLoading(true);
    try {
      const data = await fetchMessages(channelId);
      setMessages(data);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // WebSocket handler for new messages
  const handleNewMessage = (message: Message) => {
    setMessages((prev) => {
      // Avoid duplicates
      if (prev.some((m) => m.id === message.id)) {
        return prev;
      }
      // Only add top-level messages (no parentId) to the main list
      if (!message.parentId) {
        return [...prev, message];
      }
      return prev;
    });
  };

  useWebSocket(channelId, handleNewMessage);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim() || !channelId) return;

    try {
      await createMessage(channelId, currentUser, newMessageText.trim());
      setNewMessageText('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!channelId) {
    return (
      <div className="message-list">
        <div className="empty-state">Select a channel to start messaging</div>
      </div>
    );
  }

  return (
    <div className="message-list">
      <div className="messages-container">
        {isLoading ? (
          <div className="loading">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="empty-state">No messages yet. Start the conversation!</div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className="message" onClick={() => onOpenThread(message.id)}>
              <div className="message-header">
                <span className="message-author">{message.author}</span>
                <span className="message-time">{formatTime(message.createdAt)}</span>
              </div>
              <div className="message-text">{message.text}</div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="message-input-form">
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessageText}
          onChange={(e) => setNewMessageText(e.target.value)}
          className="message-input"
        />
        <button type="submit" className="send-button">
          Send
        </button>
      </form>
    </div>
  );
}

