import nats, { Message, Stan } from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { TicketCreatedListener } from './events/ticket-created-listener';

console.clear();

// generate random client ID
// to run multiple listeners
const clientID = randomBytes(4).toString('hex');

const stan = nats.connect('ticketing', clientID, {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('Listener connected to NATS');

  stan.on('close', () => {
    console.log('NATS connection closed');
    process.exit();
  });

  new TicketCreatedListener(stan).listen();
});

// watching interrupt signal
process.on('SIGINT', () => stan.close());
// watching terminate signal
process.on('SIGTERM', () => stan.close());
