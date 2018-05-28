/* eslint-disable class-methods-use-this, consistent-return */
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();
const secret = process.env.JWT_SECRET;

class Authorization {
  /**
   * @description Verify authenticated userId supplied in token
   *
   * @param {Object} req - HTTP Request
   * @param {Object} res - HTTP Response
   * @param {Function} next
   *
   * @return {Function} next
   */
  static verifyUser(req, res, next) {
    const token =
    req.headers['x-access-token'] || req.body.token || req.query.token;

    if (token) {
      jwt.verify(token, secret, (err, decoded) => {
        if (err) {
          return res.status(401).json({
            status: 'fail',
            message: 'Invalid credentials supplied',
          });
        }
        req.decoded = decoded;
        return next();
      });
    } else {
      return res.status(401).json({
        status: 'fail',
        message: 'No Token provided',
      });
    }
  }

  /**
   * @description Verify if user is an admin
   *
   * @param {Object} req - HTTP Request
   * @param {Object} res - HTTP Response
   * @param {Function} next
   *
   * @return {Function} next
   */
  static verifyAdmin(req, res, next) {
    if (req.decoded.role === 'admin') {
      next();
    } else {
      res.status(403).json({
        status: 'fail',
        message: 'Unauthorized',
      });
    }
  }
}

export default Authorization;
