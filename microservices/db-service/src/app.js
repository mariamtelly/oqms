import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Get the list of services
app.get('/services', (_req, res) => {
  const data = fs.readFileSync(path.join(__dirname, 'data', 'services.json'));
  res.json(JSON.parse(data));
});

app.get('/services/:id', (req, res) => {
  const services = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'services.json')));
  const service = services.find((service) => service.id == req.params.id);
  if (!service) {
    return res.status(404).json({ message: 'Service not found' });
  }
  res.json(service);
});

// Get the list of counters
app.get('/counters', (_req, res) => {
  const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'counters.json')));
  res.json(data);
});

// Get the services for a specific counter
app.get('/:counterId/services', (req, res) => {
  const counter = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'counters.json'))).find((counter) => counter.id == req.params.counterId);
  if (!counter) {
    return res.status(404).json({ message: 'Counter not found' });
  }

  const services = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'services.json')));
  const counterServices = counter.services.map((serviceId) => services.find((service) => service.id == serviceId));
  res.json(counterServices);
});

// Write a ticket in tickets.json
// Create the file if it doesn't exist
// If it exists, append the ticket
app.post('/tickets', (req, res) => {
  const ticketsFilePath = path.join(__dirname, 'data', 'tickets.json');
  const tickets = fs.existsSync(ticketsFilePath) ? JSON.parse(fs.readFileSync(ticketsFilePath)) : [];
  tickets.push(req.body);
  console.log('Writing tickets:', tickets);
  fs.writeFileSync(ticketsFilePath, JSON.stringify(tickets, null, 2));
  res.status(201).json(req.body);
});

const PORT = process.env.PORT || 8004;
app.listen(PORT, () => {
  console.log(`🗃️ DB service running on port ${PORT}`);
});