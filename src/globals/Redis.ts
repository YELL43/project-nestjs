import { createClient } from 'redis';

const redisClient = createClient({
  socket: {
    host: 'localhost',
    port: 6379,
  },
});
redisClient.on('error', (err) => console.log('Redis Client Error', err));

export { redisClient };
