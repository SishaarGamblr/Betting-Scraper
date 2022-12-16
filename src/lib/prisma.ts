import { PrismaClient } from '@prisma/client';
import Config from 'config';

export default new PrismaClient({
  datasources: {
    db: {
      url: Config.get<string>('database.url'),
    }
  }
})