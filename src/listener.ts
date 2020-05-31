import nats, { Message } from 'node-nats-streaming';
import { randomBytes } from 'crypto';

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

  const options = stan
    .subscriptionOptions()
    .setManualAckMode(true)
    .setDeliverAllAvailable();
  const subscription = stan.subscribe('ticket:created', options);

  subscription.on('message', (msg: Message) => {
    const data = msg.getData();

    if (typeof data === 'string') {
      console.log(`Received event #${msg.getSequence()}, with data: ${data}`);
    }

    msg.ack();
  });
});

// watching interrupt signal
process.on('SIGINT', () => stan.close());
// watching terminate signal
process.on('SIGTERM', () => stan.close());
