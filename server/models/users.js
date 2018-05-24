import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import db from './db';

dotenv.config();

const hash = bcrypt.hashSync(process.env.ADMIN_PASSWORD, 10);
const adminEmail = process.env.ADMIN_EMAIL;

const users = (client) => {
  const queryString = `
  DROP TABLE IF EXISTS Users CASCADE;
  DROP TYPE IF EXISTS role_allowed;
  CREATE TYPE role_allowed AS ENUM (
    'admin',
    'user'
  );

  CREATE TABLE Users (
      userId serial PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role role_allowed NOT NULL DEFAULT 'user',
      createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  INSERT INTO Users (email, password, role)
  VALUES
  ('${adminEmail}', '${hash}' , 'admin');`;

  client.query(queryString)
    .then(res => res)
    .catch(e => e.message);
};

users(db);
