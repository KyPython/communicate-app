import { useEffect, useState, useRef } from 'react';
import { fetchThread, createMessage } from '../api';
import { useWebSocket } from '../hooks/useWebSocket';
import type { Message } from '../types';
import './ThreadView.css';

interface ThreadViewProps {
  messageId: string;
  channelId: string;
  currentUser: string;
  onClose: () => void;
}

export function ThreadView({
  messageId,
  channelId,
  currentUser,
  onClose,
}: ThreadViewProps) {
  const [parent, setParent] = useState<Message | null>(null);
  const [replies, setReplies] = useState<Message[]>([]);
  const [newReplyText, setNewReplyText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const repliesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    repliesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    loadThread();
  }, [messageId]);

  useEffect(() => {
    scrollToBottom();
  }, [replies]);

  const loadThread = async () => {
    setIsLoading(true);
    try {
      const data = await fetchThread(messageId);
      setParent(data.parent);
      setReplies(data.replies);
    } catch (error) {
      console.error('Failed to load thread:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // WebSocket handler for new replies
  const handleNewMessage = (message: Message) => {
    // Only process replies to this thread
    if (message.parentId === messageId) {
      setReplies((prev) => {
        // Avoid duplicates
        if (prev.some((m) => m.id === message.id)) {
          return prev;
        }
        return [...prev, message];
      });
    }
  };

  useWebSocket(channelId, handleNewMessage);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReplyText.trim()) return;

    try {
      await createMessage(channelId, currentUser, newReplyText.trim(), messageId);
      setNewReplyText('');
    } catch (error) {
      console.error('Failed to send reply:', error);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (isLoading) {
    return (
      <div className="thread-view">
        <div className="thread-header">
          <button onClick={onClose} className="close-button">
            ×
          </button>
          <h3>Thread</h3>
        </div>
        <div className="loading">Loading thread...</div>
      </div>
    );
  }

  if (!parent) {
    return (
      <div className="thread-view">
        <div className="thread-header">
          <button onClick={onClose} className="close-button">
            ×
          </button>
          <h3>Thread</h3>
        </div>
        <div className="error">Thread not found</div>
      </div>
    );
  }

  return (
    <div className="thread-view">
      <div className="thread-header">
        <button onClick={onClose} className="close-button">
          ×
        </button>
        <h3>Thread</h3>
      </div>

      <div className="thread-content">
        <div className="parent-message">
          <div className="message-header">
            <span className="message-author">{parent.author}</span>
            <span className="message-time">{formatTime(parent.createdAt)}</span>
          </div>
          <div className="message-text">{parent.text}</div>
        </div>

        <div className="replies-section">
          <div className="replies-header">
            {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
          </div>
          <div className="replies">
            {replies.map((reply) => (
              <div key={reply.id} className="reply">
                <div className="message-header">
                  <span className="message-author">{reply.author}</span>
                  <span className="message-time">{formatTime(reply.createdAt)}</span>
                </div>
                <div className="message-text">{reply.text}</div>
              </div>
            ))}
            <div ref={repliesEndRef} />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="reply-input-form">
          <input
            type="text"
            placeholder="Reply to thread..."
            value={newReplyText}
            onChange={(e) => setNewReplyText(e.target.value)}
            className="reply-input"
          />
          <button type="submit" className="send-button">
            Reply
          </button>
        </form>
      </div>
    </div>
  );
}

