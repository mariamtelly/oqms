import express from 'express';
import amqp from 'amqplib';
import dotenv from 'dotenv';
import { publish } from './utils/rabbit.js';
import cors from 'cors';
import axios from 'axios';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

let channel;

const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://guest:guest@rabbitmq:5672');
    channel = await connection.createChannel();
    console.log('✅ Connected to RabbitMQ');
  } catch (error) {
    console.error('❌ RabbitMQ connection failed:', error);
  }
};

app.post('/enqueue', async (req, res) => {
  if (!req.body.service_tag) {
    return res.status(400).json({ error: 'Missing ticket or service_tag' });
  }
  
  try {
    await publish(channel, req.body);
    res.status(200).json({ message: 'Ticket enqueued' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to enqueue ticket' });
  }
});

app.get('/time/:service_tag/:service_id', async (req, res) => {
  const service_tag = req.params.service_tag;
  const service_id = req.params.service_id;

  try {
    const queueInfo = await channel.assertQueue(service_tag, { durable: true });
    console.log('Queue info:', queueInfo);
    const queueLength = queueInfo.messageCount;
    
    const response = await axios.get(`${process.env.DB_SERVICE_URL}/counters`);
    const counters = response.data;

    const eligibleCounters = counters.filter(counter =>
      counter.services.includes(parseInt(service_id)) 
    );

    const nbCounters = eligibleCounters.length;
    if (nbCounters === 0) {
      return res.status(400).json({ error: 'No counters available for this service' });
    }

    const serviceResponse = await axios.get(`${process.env.DB_SERVICE_URL}/services`);
    const services = serviceResponse.data;
    const service = services.find(s => s.tag === service_tag);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    const waitTime = Math.ceil((queueLength / nbCounters) * service.service_time) + 2;
    return res.json({ estimated_wait_time: waitTime });
  } catch (error) {
    console.error('Failed to estimate wait time:', error.message);
    return res.status(500).json({ error: 'Failed to estimate wait time' });
  }
});

app.get('/queues/:counterId', async (req, res) => {
  let services;
  try {
    const resp = await axios.get(`${process.env.DB_SERVICE_URL}/${req.params.counterId}/services`);
    services = resp.data;

    let queueStats = [];
    for (let service of services) {
      try {
        const queueInfo = await channel.checkQueue(service.tag);
        queueStats.push({
          service,
          length: queueInfo.messageCount
        });
      } catch (err) {
        console.log('Queue not found:', service.tag);
      }
    }

    queueStats = queueStats.filter(q => q.length > 0);
    if (queueStats.length === 0) {
      return res.json({}); 
    }

    queueStats.sort((a, b) => {
      if (b.length !== a.length) return b.length - a.length; 
      return a.service.service_time - b.service.service_time; 
    });

    const selectedService = queueStats[0].service;
    const message = await channel.get(selectedService.tag, { noAck: true });

    if (!message) {
      return res.status(404).json({ error: 'No ticket found in selected queue' });
    }

    let ticket = JSON.parse(message.content.toString());
    ticket = {
      ...ticket,
      called_at: Date.now()
    }
    res.json(ticket);
  } catch (error) {
    console.error('Error fetching next client', error.message);
    return res.status(500).json({ error: 'Failed to reach DB' });
  }
});

const PORT = process.env.PORT || 8003;
app.listen(PORT, async () => {
  await connectRabbitMQ();
  console.log(`🚀 Queue Service listening on port ${PORT}`);
});