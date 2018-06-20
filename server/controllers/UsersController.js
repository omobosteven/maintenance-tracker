import bcrypt from 'bcryptjs';
import GenerateToken from './helper/GenerateToken';
import db from '../models/db';

const secret = process.env.JWT_SECRET;

class UsersController {
  /**
   * @description Method to create a new user
   *
   * @param {Object} request - HTTP Request
   * @param {Object} response - HTTP Response
   *
   * @return {Object} Returned object
   */
  static create(request, response) {
    const { body } = request;
    const email = body.email.trim().toLowerCase();
    const hashPassword = bcrypt.hashSync(body.password.trim(), 10);

    const queryEmailCheck = `SELECT email FROM "Users"
                            WHERE email = '${email}';`;
    const queryCreateUser = `INSERT INTO "Users" (email, password)
                            VALUES
                            ('${email}', '${hashPassword}')
                            RETURNING "userId", "roleId", email`;

    db.connect()
      .then((client) => {
        client.query(queryEmailCheck)
          .then((emailExist) => {
            if (emailExist.rows[0]) {
              client.release();
              return response.status(409).json({
                status: 'fail',
                message: 'User with this email already exist',
              });
            }

            return client.query(queryCreateUser)
              .then((savedUser) => {
                const authToken = GenerateToken.token(savedUser.rows[0], secret);
                client.release();
                return response.status(201).json({
                  status: 'success',
                  message: 'User created successfully',
                  data: {
                    role: (savedUser.rows[0].roleId === 1) ? 'admin' : 'user',
                    email: savedUser.rows[0].email,
                    token: authToken,
                  },
                });
              })
              .catch(() => {
                client.release();
                return response.status(500).json({
                  status: 'fail',
                  message: 'Internal server error',
                });
              });
          })
          .catch(() => {
            client.release();
            return response.status(500).json({
              status: 'fail',
              message: 'Internal server error',
            });
          });
      });
  }

  /**
   * @description Method to login a new user
   *
   * @param {Object} request - HTTP Request
   * @param {Object} response - HTTP Response
   *
   * @return {Object} Returned object
   */
  static login(request, response) {
    const { body } = request;

    const emailAddress = body.email.trim().toLowerCase();
    const queryGetUser = `SELECT "userId", email, "roleId", password
                          FROM "Users"
                          WHERE email = '${emailAddress}'`;

    db.connect()
      .then((client) => {
        client.query(queryGetUser)
          .then((user) => {
            if (!user.rows[0]) {
              client.release();
              return response.status(404).json({
                status: 'fail',
                message: 'User was not found',
              });
            }

            const checkPassword = bcrypt
              .compareSync(body.password.trim(), user.rows[0].password);
            if (!checkPassword) {
              client.release();
              return response.status(422).json({
                status: 'fail',
                message: 'Wrong password entered',
              });
            }

            const { userId, roleId, email } = user.rows[0];

            const authToken = GenerateToken.token({
              userId,
              roleId,
              email,
            }, secret);
            client.release();
            return response.status(200).json({
              status: 'success',
              message: 'Sign in successfully',
              data: {
                role: (roleId === 1) ? 'admin' : 'user',
                email,
                token: authToken,
              },
            });
          })
          .catch(() => {
            client.release();
            return response.status(500).json({
              status: 'error',
              message: 'internal server error',
            });
          });
      });
  }
}

export default UsersController;
