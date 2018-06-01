import db from './db';

const requests = (client) => {
  const queryString = `
  DROP TABLE IF EXISTS Requests;
  DROP TYPE IF EXISTS type_allowed;
  CREATE TYPE type_allowed AS ENUM (
    'repair',
    'maintenance'
  );

  DROP TYPE IF EXISTS status_allowed;
  CREATE TYPE status_allowed AS ENUM (
    'approved',
    'pending',
    'disapproved',
    'resolved'
  );

  CREATE TABLE Requests (
      requestId SERIAL PRIMARY KEY,
      userId INTEGER REFERENCES users(userid),
      type type_allowed NOT NULL,
      category VARCHAR(255) NOT NULL,
      item VARCHAR(255) NOT NULL,
      description VARCHAR(255) NOT NULL,
      status status_allowed NOT NULL DEFAULT 'pending',
      createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  );`;

  client.query(queryString)
    .then(res => res)
    .catch(e => e.message);
};

requests(db);
