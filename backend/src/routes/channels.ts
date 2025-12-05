import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { store } from '../store';
import { CreateChannelRequest, Channel } from '../types';

const router = Router();

// GET /channels
router.get('/', (req: Request, res: Response) => {
  const channels = store.getAllChannels();
  res.json(channels);
});

// POST /channels
router.post('/', (req: Request<{}, {}, CreateChannelRequest>, res: Response) => {
  const { name, description } = req.body;

  if (!name || !description) {
    return res.status(400).json({ error: 'Name and description are required' });
  }

  const channel: Channel = {
    id: uuidv4(),
    name,
    description,
    createdAt: new Date(),
  };

  store.addChannel(channel);
  res.status(201).json(channel);
});

export default router;

