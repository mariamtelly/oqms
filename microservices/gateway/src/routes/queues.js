import express from 'express';
import axios from 'axios';

const router = express.Router();

// To get the next client for a specific counter
router.get('/:counterId', async (req, res) => {
  const { counterId } = req.params;

  try {
    const response = await axios.get(`${process.env.QUEUE_SERVICE_URL}/queues/${counterId}`);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch next ticket' });
  }
}); 

export default router;