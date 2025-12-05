# Communicate

A minimal team communication web app demonstrating good communication patterns: channels, messages, and threaded replies.

## Overview

Communicate is a lightweight chat application that showcases essential communication patterns for team collaboration. It's not a full Slack clone—just a focused demonstration of how structured communication can improve team coordination and reduce noise.

## Features

- **Channels**: Organize conversations by topic or team
- **Messages**: Post messages in channels
- **Threaded Replies**: Click any message to view and reply in a thread, keeping conversations organized
- **Real-time Updates**: WebSocket integration for instant message delivery

## Tech Stack

### Backend
- Node.js + Express + TypeScript
- Socket.IO for WebSocket real-time communication
- In-memory storage (simple and fast for demo purposes)

### Frontend
- React + TypeScript
- Vite for fast development and building
- Socket.IO client for real-time updates

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation & Running

1. **Install backend dependencies:**
```bash
cd backend
npm install
```

2. **Install frontend dependencies:**
```bash
cd ../frontend
npm install
```

3. **Run the backend server:**
```bash
cd backend
npm run dev
```
The backend will start on `http://localhost:3001`

4. **Run the frontend (in a new terminal):**
```bash
cd frontend
npm run dev
```
The frontend will start on `http://localhost:5173`

5. **Open your browser:**
Navigate to `http://localhost:5173` to use the app.

## Project Structure

```
communicate-app/
├── backend/
│   ├── src/
│   │   ├── routes/        # REST API routes
│   │   ├── types.ts        # TypeScript type definitions
│   │   ├── store.ts        # In-memory data storage
│   │   ├── websocket.ts    # WebSocket handling
│   │   └── index.ts        # Express server entry point
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── api.ts          # API client functions
│   │   ├── types.ts        # TypeScript type definitions
│   │   ├── App.tsx         # Main app component
│   │   └── main.tsx        # React entry point
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## API Endpoints

### Channels
- `GET /channels` - Get all channels
- `POST /channels` - Create a new channel

### Messages
- `GET /channels/:channelId/messages` - Get messages in a channel
- `POST /channels/:channelId/messages` - Post a new message (optionally with `parentId` for replies)

### Threads
- `GET /messages/:messageId/replies` - Get thread data (parent message + replies)

## WebSocket Events

### Client → Server
- `join-channel` - Join a channel room to receive updates
- `leave-channel` - Leave a channel room

### Server → Client
- `new-message` - Broadcast when a new message is created

## How This Reflects "Communicate" from The Pragmatic Programmer

The Pragmatic Programmer emphasizes that **"It's Both What You Say and the Way You Say It"** and that **"There's No Such Thing as a Free Lunch"**. This app demonstrates several key communication principles:

1. **Structured Communication**: Channels provide context and organization, preventing information overload. This aligns with the principle that good communication requires structure.

2. **Threading Reduces Noise**: By allowing threaded replies, conversations stay focused. A reply to a specific message doesn't clutter the main channel, demonstrating that **how** you communicate matters as much as **what** you communicate.

3. **Real-time but Not Intrusive**: WebSocket updates ensure timely delivery without requiring constant polling, showing efficient communication patterns.

4. **Clear Boundaries**: Each channel has a purpose (name + description), making it clear what belongs where. This reflects the importance of establishing clear communication boundaries.

5. **Minimal but Complete**: The app is intentionally minimal—it demonstrates the core patterns without unnecessary complexity, embodying the principle of "good enough" software that solves real problems.

The app shows that effective team communication isn't about having every feature—it's about having the right structure and patterns that enable clear, organized, and timely information exchange.

## Development

### Backend Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Run production build

### Frontend Scripts
- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## License

MIT

