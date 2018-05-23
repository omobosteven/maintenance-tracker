/* eslint-disable class-methods-use-this */
import bcrypt from 'bcryptjs';
import Util from './Util';
import Controller from './Controller';
import db from '../models/db';

class UsersController extends Controller {
  /**
   * @description Method to create a new user
   *
   * @param {Object} req - HTTP Request
   * @param {Object} res - HTTP Response
   *
   * @return {Object} Returned object
   */
  static create(req, res) {
    const { body } = req;
    const email = body.email.trim().toLowerCase();
    const hashPassword = bcrypt.hashSync(body.password.trim(), 10);

    const queryEmailCheck = `SELECT email FROM users
                            WHERE email = '${email}';`;
    const queryCreateUser = `INSERT INTO users (email, password)
                            VALUES
                            ('${email}', '${hashPassword}')
                            RETURNING *`;

    db.connect()
      .then((client) => {
        client.query(queryEmailCheck)
          .then((emailExist) => {
            if (emailExist.rows[0]) {
              return res.status(409).json({
                status: 'fail',
                message: 'User with this email already exist',
              });
            }

            return client.query(queryCreateUser)
              .then((savedUser) => {
                const authToken = Util.token(savedUser.rows[0]);
                return res.status(201).json({
                  status: 'success',
                  message: 'User created successfully',
                  data: {
                    token: authToken,
                  },
                });
              })
              .catch(() => {
                client.release();
                return res.status(500).json({
                  status: 'fail',
                  message: 'Internal server error',
                });
              });
          })
          .catch(() => {
            client.release();
            return res.status(500).json({
              status: 'fail',
              message: 'Internal server error',
            });
          });
      });
  }

  /**
   * @description Method to login a new user
   *
   * @param {Object} req - HTTP Request
   * @param {Object} res - HTTP Response
   *
   * @return {Object} Returned object
   */
  static login(req, res) {
    const { body } = req;

    const emailAddress = body.email.trim().toLowerCase();
    const queryGetUser = `SELECT userId, email, role, password
                          FROM users
                          WHERE email = '${emailAddress}'`;

    db.connect()
      .then((client) => {
        client.query(queryGetUser)
          .then((user) => {
            if (!user.rows[0]) {
              return res.status(404).json({
                status: 'fail',
                message: 'User not found',
              });
            }

            const checkPassword = bcrypt
              .compareSync(body.password.trim(), user.rows[0].password);
            if (!checkPassword) {
              return res.status(400).json({
                status: 'fail',
                message: 'Wrong password',
              });
            }

            const authToken = Util.token(user.rows[0]);
            return res.status(200).json({
              status: 'success',
              message: 'Sign in successfully',
              data: {
                token: authToken,
              },
            });
          })
          .catch(() => {
            client.release();
            return res.status(500).json({
              status: 'error',
              message: 'internal server error',
            });
          });
      });
  }
}

export default UsersController;
