import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { store } from '../store';
import { CreateMessageRequest, Message } from '../types';
import { broadcastMessage } from '../websocket';

const router = Router({ mergeParams: true });

// GET /channels/:channelId/messages
router.get('/', (req: Request, res: Response) => {
  const { channelId } = req.params;
  const { includeReplies } = req.query;

  const channel = store.getChannel(channelId);
  if (!channel) {
    return res.status(404).json({ error: 'Channel not found' });
  }

  let messages = store.getMessagesByChannel(channelId);

  // Filter to only top-level messages (no parentId) unless includeReplies is true
  if (includeReplies !== 'true') {
    messages = messages.filter(msg => !msg.parentId);
  }

  res.json(messages);
});

// POST /channels/:channelId/messages
router.post('/', (req: Request<{ channelId: string }, {}, CreateMessageRequest>, res: Response) => {
  const { channelId } = req.params;
  const { author, text, parentId } = req.body;

  if (!author || !text) {
    return res.status(400).json({ error: 'Author and text are required' });
  }

  const channel = store.getChannel(channelId);
  if (!channel) {
    return res.status(404).json({ error: 'Channel not found' });
  }

  // If parentId is provided, verify it exists
  if (parentId) {
    const parentMessage = store.getMessage(parentId);
    if (!parentMessage) {
      return res.status(404).json({ error: 'Parent message not found' });
    }
    // Ensure parent is in the same channel
    if (parentMessage.channelId !== channelId) {
      return res.status(400).json({ error: 'Parent message must be in the same channel' });
    }
  }

  const message: Message = {
    id: uuidv4(),
    channelId,
    author,
    text,
    createdAt: new Date(),
    parentId,
  };

  store.addMessage(message);
  broadcastMessage(channelId, message);
  res.status(201).json(message);
});

export default router;

