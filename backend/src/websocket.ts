import { Server } from 'socket.io';
import { Message } from './types';

let ioInstance: Server | null = null;

export function initializeWebSocket(io: Server) {
  ioInstance = io;

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Join channel room
    socket.on('join-channel', (channelId: string) => {
      socket.join(`channel:${channelId}`);
      console.log(`Client ${socket.id} joined channel ${channelId}`);
    });

    // Leave channel room
    socket.on('leave-channel', (channelId: string) => {
      socket.leave(`channel:${channelId}`);
      console.log(`Client ${socket.id} left channel ${channelId}`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
}

export function broadcastMessage(channelId: string, message: Message) {
  if (ioInstance) {
    ioInstance.to(`channel:${channelId}`).emit('new-message', message);
  }
}

