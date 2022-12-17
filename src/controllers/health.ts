import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

export default async function healthController(fastify: FastifyInstance) {
  fastify.get(
    '/health',
    async function (_request: FastifyRequest, reply: FastifyReply) {
      reply.send('ok');
    }
  );
}
