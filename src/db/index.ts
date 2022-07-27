process.env.NODE_CONFIG_DIR = '../../config'
import Config from 'config';

export default {
  client: 'postgres',
  connection: {
    host: Config.get<string>('database.host'),
    port: Config.get<number>('database.port'),
    user: Config.get<string>('database.user'),
    password: Config.get<string>('database.password'),
    database: Config.get<string>('database.database'),
    ssl: Config.get<boolean>('database.ssl')
  }
};