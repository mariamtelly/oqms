import express from 'express';
import axios from 'axios';

const router = express.Router();

router.get('/services', async (_req, res) => {
  try {
    const response = await axios.get(`${process.env.DB_SERVICE_URL}/services`);
    res.json(response.data);
  } catch (err) {
    console.error('Error from db-service:', err.message);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

router.get('/counters', async (_req, res) => {
  try {
    const response = await axios.get(`${process.env.DB_SERVICE_URL}/counters`);
    res.json(response.data);
  } catch (err) {
    console.error('Error from db-service:', err.message);
    res.status(500).json({ error: 'Failed to fetch counters' });
  }
});

router.get('/:counterId/services', async (req, res) => {
  try {
    const response = await axios.get(`${process.env.DB_SERVICE_URL}/${req.params.counterId}/services`);
    res.json(response.data);
  } catch (err) {
    console.error('Error from db-service:', err.message);
    res.status(500).json({ error: 'Failed to fetch services for counter' });
  }
});

router.post('/tickets', async (req, res) => {
  try {
    const response = await axios.post(`${process.env.DB_SERVICE_URL}/tickets`, req.body);
    res.json(response.data);
  } catch (err) {
    console.error('Error saving ticket to db-service:', err.message);
    res.status(500).json({ error: 'Failed to write to database' });
  }
});

export default router;