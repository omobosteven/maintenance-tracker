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
}

export default UsersController;
