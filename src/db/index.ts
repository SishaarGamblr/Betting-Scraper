process.env.NODE_CONFIG_DIR = '../../config';
import Config from 'config';
import { Knex } from 'knex';

const connection: Knex.Config = {
  client: 'postgres',
  connection: {
    connectionString: Config.get<string>('database.url'),
    ssl: !Config.get<boolean>('database.ssl')
      ? undefined
      : { rejectUnauthorized: false },
  },
};

export default connection;
