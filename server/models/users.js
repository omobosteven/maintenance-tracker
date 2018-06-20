
import bcrypt from 'bcryptjs';
import db from './db';

const hash = bcrypt.hashSync(process.env.ADMIN_PASSWORD, 10);
const adminEmail = process.env.ADMIN_EMAIL;

const users = (client) => {
  const queryString = `
  DROP TABLE IF EXISTS "Roles" CASCADE;
  CREATE TABLE "Roles" (
    "roleId" serial PRIMARY KEY,
    "roleName" VARCHAR (50) NOT NULL
  );

  INSERT INTO "Roles" ("roleName")
  VALUES ('admin'), ('user');

  DROP TABLE IF EXISTS "Users" CASCADE;
  CREATE TABLE "Users" (
      "userId" serial PRIMARY KEY,
      "roleId" INTEGER REFERENCES "Roles" ("roleId") DEFAULT 2 NOT NULL,
      email VARCHAR(50) UNIQUE NOT NULL,
      password VARCHAR(100) NOT NULL,
      "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  INSERT INTO "Users" (email, password, "roleId")
  VALUES
  ('${adminEmail}', '${hash}', 1);`;

  client.query(queryString)
    .then(res => res)
    .catch(e => e.message);
};

users(db);
