import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import ticketsRoutes from './routes/tickets.js';
import queuesRoutes from './routes/queues.js';
import dbRoutes from './routes/db.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/tickets', ticketsRoutes); // Get a ticket
app.use('/api/queues', queuesRoutes); // Get the next ticket for a counter
app.use('/api/db', dbRoutes); // Save a served ticket

const PORT = process.env.PORT || 8001;
app.listen(PORT, () => {
  console.log(`Gateway running on port ${PORT}`);
});
