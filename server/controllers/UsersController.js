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
    const username = body.username.trim().toLowerCase();
    const email = body.email.trim().toLowerCase();
    const hashPassword = bcrypt.hashSync(body.password.trim(), 10);

    const queryUserCheck = `SELECT email, username FROM "Users"
                            WHERE email = '${email}' OR username = '${username}';`;
    const queryCreateUser = `INSERT INTO "Users" (email, username, password)
                            VALUES
                            ('${email}', '${username}', '${hashPassword}')
                            RETURNING "userId", "roleId", email, username`;

    db.connect()
      .then((client) => {
        client.query(queryUserCheck)
          .then((userExist) => {
            if (userExist.rows[0]) {
              client.release();
              return response.status(409).json({
                status: 'fail',
                message: 'User with this email or username already exist',
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
                    username: savedUser.rows[0].username,
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
    const queryGetUser = `SELECT "userId", email, username, "roleId", password
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

            const {
              userId, roleId, email, username,
            } = user.rows[0];

            const authToken = GenerateToken.token({
              userId,
              username,
              roleId,
              email,
            }, secret);
            client.release();
            return response.status(200).json({
              status: 'success',
              message: 'Sign in successfully',
              data: {
                role: roleId,
                username,
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

  /**
   * @description Method to get details of a user
   *
   * @param {Object} request - HTTP Request
   * @param {Object} response - HTTP Response
   *
   * @return {Object} Returned object
   */
  static userDetails(request, response) {
    const { id } = request.params;
    const { userId } = request.decoded;

    const queryGetUserDetails = `SELECT "userId", email, "roleId"
    FROM "Users"
    WHERE "userId" = '${id}';`;

    db.connect()
      .then((client) => {
        client.query(queryGetUserDetails)
          .then((userDetails) => {
            if (userDetails.rows.length < 1) {
              client.release();
              return response.status(404).json({
                status: 'fail',
                message: 'User not found',
              });
            }

            if (userDetails.rows[0].userId !== userId) {
              client.release();
              return response.status(403).json({
                status: 'fail',
                message: 'You cannot view this profile',
              });
            }

            client.release();
            return response.status(200).json({
              status: 'success',
              data: {
                user: userDetails.rows[0],
              },
            });
          })
          .catch(() => {
            client.release();
            return response.status(500).json({
              status: 'error',
              message: 'Failed to fetch requests',
            });
          });
      });
  }
}

export default UsersController;
