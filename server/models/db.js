/* eslint-disable import/no-mutable-exports */
import { Client } from 'pg';
import dotenv from 'dotenv';
import config from '../config/config';

const env = process.env.NODE_ENV || 'development';
const envVariables = config[env];

dotenv.config();

let client;
if (envVariables.use_env_variable) {
  client = new Client(process.env[envVariables.use_env_variable], envVariables);
} else {
  client = new Client({
    database: envVariables.database,
    user: envVariables.username,
    password: envVariables.password,
    envVariables,
  });
}

client.connect();

export default client;
