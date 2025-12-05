import { Router, Request, Response } from 'express';
import { store } from '../store';

const router = Router({ mergeParams: true });

// GET /messages/:messageId/replies
router.get('/:messageId/replies', (req: Request, res: Response) => {
  const { messageId } = req.params;

  const parentMessage = store.getMessage(messageId);
  if (!parentMessage) {
    return res.status(404).json({ error: 'Message not found' });
  }

  const replies = store.getReplies(messageId);
  res.json({
    parent: parentMessage,
    replies,
  });
});

export default router;

