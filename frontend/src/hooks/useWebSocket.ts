import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import type { Message } from '../types';

const SOCKET_URL = 'http://localhost:3001';

export function useWebSocket(
  channelId: string | null,
  onNewMessage: (message: Message) => void
) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!channelId) return;

    // Connect to WebSocket server
    const socket = io(SOCKET_URL);
    socketRef.current = socket;

    // Join the channel room
    socket.emit('join-channel', channelId);

    // Listen for new messages
    socket.on('new-message', (message: Message) => {
      // Only process messages for the current channel
      if (message.channelId === channelId) {
        onNewMessage(message);
      }
    });

    // Cleanup on unmount or channel change
    return () => {
      if (channelId) {
        socket.emit('leave-channel', channelId);
      }
      socket.disconnect();
    };
  }, [channelId, onNewMessage]);

  return socketRef.current;
}

