import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();
const secret = process.env.JWT_SECRET;

class Util {
  /**
   * @description Method to generate token
   *
   * @param {Object} user
   *
   * @return {String} Returned token
   */
  static token(user) {
    const authToken = jwt.sign(
      user, secret,
      { expiresIn: '1d' },
    );

    return authToken;
  }
}

export default Util;
