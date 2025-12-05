import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import channelsRouter from './routes/channels';
import messagesRouter from './routes/messages';
import threadsRouter from './routes/threads';
import { initializeWebSocket } from './websocket';
import { Message } from './types';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());

// Routes
app.use('/channels', channelsRouter);
app.use('/channels/:channelId/messages', messagesRouter);
app.use('/messages', threadsRouter);

// Initialize WebSocket
initializeWebSocket(io);

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Initialize with some sample data
import { store } from './store';
import { v4 as uuidv4 } from 'uuid';

const generalChannelId = uuidv4();
const generalChannel = {
  id: generalChannelId,
  name: 'general',
  description: 'General discussion',
  createdAt: new Date(),
};
store.addChannel(generalChannel);

const welcomeMessage: Message = {
  id: uuidv4(),
  channelId: generalChannelId,
  author: 'System',
  text: 'Welcome to Communicate! This is a demonstration of good communication patterns.',
  createdAt: new Date(),
};
store.addMessage(welcomeMessage);

