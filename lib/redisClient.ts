import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_URL, // Set your Redis URL in environment variables
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

redisClient.connect();

export default redisClient;