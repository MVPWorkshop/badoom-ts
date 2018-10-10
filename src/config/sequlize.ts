import { POSTGRES_DATABASE, POSTGRES_HOST, POSTGRES_PASSWORD, POSTGRES_PORT, POSTGRES_USER } from './secrets';

const config: any = {};
const env = process.env.NODE_ENV;

config[env] = {
  'username': POSTGRES_USER,
  'password': POSTGRES_PASSWORD,
  'database': POSTGRES_DATABASE,
  'host': POSTGRES_HOST,
  'port': POSTGRES_PORT,
  'dialect': 'postgres',
};

module.exports = config;
