import express from 'express';
import axios from 'axios';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const response = await axios.post(`${process.env.TICKET_SERVICE_URL}/tickets`, req.body);
    res.json(response.data);
  } catch (err) {
    console.error('Error from ticket-service:', err.message);
    res.status(500).json({ error: 'Failed to get ticket' });
  }
});

export default router;