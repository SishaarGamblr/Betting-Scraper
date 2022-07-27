process.env.NODE_CONFIG_DIR = '../../config'
import Config from 'config';

export default {
  client: 'postgres',
  connection: Config.get<string>('database.url')
};