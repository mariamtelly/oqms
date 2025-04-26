import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import ticketRoutes from './routes/tickets.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/tickets', ticketRoutes);

const PORT = process.env.PORT || 8002;
app.listen(PORT, () => {
  console.log(`🎫 Ticket Service running on port ${PORT}`);
});