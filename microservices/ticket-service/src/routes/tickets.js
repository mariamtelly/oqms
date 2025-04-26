import express from 'express';
import { generateTicketNumber } from '../utils/generator.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { id } = req.body;

  if (!id) return res.status(400).json({ error: 'Service is required' });

  try {
    const ticket = await generateTicketNumber(id);
    if (!ticket.error) res.json(ticket);
  } catch (err) {
    res.status(500).json({ error: 'Ticket generation failed' });
  }
});

export default router;