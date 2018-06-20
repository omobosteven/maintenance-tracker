import db from './db';

const requests = (client) => {
  const queryString = `
  DROP TABLE IF EXISTS "RequestTypes" CASCADE;
  CREATE TABLE "RequestTypes" (
    "typeId" SERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL
  );

  INSERT INTO "RequestTypes" (type)
  VALUES ('repair'), ('maintenance');

  DROP TABLE IF EXISTS "RequestStatus" CASCADE;
  CREATE TABLE "RequestStatus" (
    "statusId" SERIAL PRIMARY KEY,
    status VARCHAR(50) NOT NULL
  );

  INSERT INTO "RequestStatus" (status)
  VALUES ('pending'), ('approved'), ('disapproved'), ('resolved');

  DROP SEQUENCE IF EXISTS request_ref_no CASCADE;
  CREATE SEQUENCE request_ref_no
  MINVALUE 100000
  START 100000
  CACHE 1;

  DROP TABLE IF EXISTS "Requests";
  CREATE TABLE "Requests" (
      "requestId" SERIAL PRIMARY KEY,
      "userId" INTEGER REFERENCES "Users" ("userId"),
      ref_no INTEGER NOT NULL DEFAULT nextval('request_ref_no'),
      "typeId" INTEGER REFERENCES "RequestTypes" ("typeId") NOT NULL,
      "statusId" INTEGER REFERENCES "RequestStatus" ("statusId") NOT NULL DEFAULT 1,
      category VARCHAR(255) NOT NULL,
      item VARCHAR(255) NOT NULL,
      description VARCHAR(255) NOT NULL,
      "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  );`;

  client.query(queryString)
    .then(res => res)
    .catch(e => e.message);
};

requests(db);
