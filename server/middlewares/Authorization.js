/* eslint-disable class-methods-use-this, consistent-return */
import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET;

class Authorization {
  /**
   * @description Verify authenticated userId supplied in token
   *
   * @param {Object} request - HTTP Request
   * @param {Object} response - HTTP Response
   * @param {Function} next
   *
   * @return {Function} next
   */
  static verifyUser(request, response, next) {
    const token =
    request.headers['x-access-token'] ||
    request.body.token ||
    request.query.token;

    if (token) {
      jwt.verify(token, secret, (err, decoded) => {
        if (err) {
          return response.status(401).json({
            status: 'fail',
            message: 'Invalid credentials supplied',
          });
        }
        request.decoded = decoded;
        return next();
      });
    } else {
      return response.status(401).json({
        status: 'fail',
        message: 'No Token provided',
      });
    }
  }

  /**
   * @description Verify if user is an admin
   *
   * @param {Object} request - HTTP Request
   * @param {Object} response - HTTP Response
   * @param {Function} next
   *
   * @return {Function} next
   */
  static verifyAdmin(request, response, next) {
    if (request.decoded.role === 'admin') {
      next();
    } else {
      response.status(403).json({
        status: 'fail',
        message: 'This is only available to admin',
      });
    }
  }
}

export default Authorization;
