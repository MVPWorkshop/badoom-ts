import logger from '../util/logger';
import dotenv from 'dotenv';
import fs from 'fs';

if (fs.existsSync('.env')) {
  logger.debug('Using .env file to supply config environment variables');
  dotenv.config({path: '.env'});
} else {
  logger.debug('Using .env.example file to supply config environment variables');
  dotenv.config({path: '.env.example'});  // you can delete this after you create your own .env file!
}

export const POSTGRES_HOST = process.env['POSTGRES_HOST'];
export const POSTGRES_PORT = process.env['POSTGRES_PORT'] ? parseInt(process.env['POSTGRES_PORT']) : undefined;
export const POSTGRES_DATABASE = process.env['POSTGRES_DATABASE'];
export const POSTGRES_USER = process.env['POSTGRES_USER'];
export const POSTGRES_PASSWORD = process.env['POSTGRES_PASSWORD'];

export const GOOGLE_CLIENT_ID = process.env['GOOGLE_CLIENT_ID'];
export const GOOGLE_CLIENT_SECRET = process.env['GOOGLE_CLIENT_SECRET'];

const validLoginDomains = process.env['VALID_LOGIN_DOMAINS'] || '';

export const BITGO_ACCESS_KEY = process.env['BITGO_ACCESS_KEY'];
export const BITGO_ENVIRONMENT = process.env['BITGO_ENVIRONMENT'];

export const VALID_LOGIN_DOMAINS = validLoginDomains.split(',').filter(domain => {
  return !!domain;
});

export const SECRET = process.env['SECRET'];

if (!POSTGRES_HOST) {
  logger.error('Didn\'t provide POSTGRES_HOST');
  process.exit(1);
}

if (!POSTGRES_PORT) {
  logger.error('Didn\'t provide POSTGRES_PORT');
  process.exit(1);
}

if (!POSTGRES_DATABASE) {
  logger.error('Didn\'t provide POSTGRES_DATABASE');
  process.exit(1);
}

if (!POSTGRES_USER) {
  logger.error('Didn\'t provide POSTGRES_USER');
  process.exit(1);
}

if (!POSTGRES_PASSWORD) {
  logger.error('Didn\'t provide POSTGRES_PASSWORD');
  process.exit(1);
}

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  logger.error('Didn\'t provide GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET');
  process.exit(1);
}

if (!BITGO_ACCESS_KEY) {
  logger.error('Didn\'t provide BITGO_ACCESS_KEY');
  process.exit(1);
}

if (BITGO_ENVIRONMENT !== 'test' && BITGO_ENVIRONMENT !== 'prod') {
  logger.error('BITGO_ENVIRONMENT must be either \'test\' or \'prod\'');
  process.exit(1);
}

if (!SECRET) {
  logger.error('Didn\'t provide SECRET');
  process.exit(1);
}
