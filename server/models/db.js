/* eslint-disable import/no-mutable-exports */
import { Pool } from 'pg';
import dotenv from 'dotenv';
import config from '../config/config';

const env = process.env.NODE_ENV || 'development';
const envVariables = config[env];

dotenv.config();

let db;
if (envVariables.use_env_variable) {
  db = new Pool(process.env[envVariables.use_env_variable], envVariables);
} else {
  db = new Pool({
    database: envVariables.database,
    user: envVariables.username,
    password: envVariables.password,
    envVariables,
  });
}

export default db;
