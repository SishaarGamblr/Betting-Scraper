import { FastifyInstance } from 'fastify';

import mlbLinesController from './controllers/mlb/lines';
import nflLinesController from './controllers/nfl/lines';
import healthController from './controllers/health';
import nbaLinesController from './controllers/nba/lines';

export default async function router(fastify: FastifyInstance) {
  fastify.register(healthController);
  fastify.register(mlbLinesController, { prefix: '/mlb' });
  fastify.register(nflLinesController, { prefix: '/nfl' });
  fastify.register(nbaLinesController, { prefix: '/nba' });
}
