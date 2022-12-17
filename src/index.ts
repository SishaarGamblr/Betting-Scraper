import app from './app';

const FASTIFY_PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

try {
  app.listen({
    port: FASTIFY_PORT,
    host: '0.0.0.0',
  });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}

console.log(`🚀  Fastify server running on port ${FASTIFY_PORT}`);
