import jwt from 'jsonwebtoken';

class GenerateToken {
  /**
   * @description Method to generate token
   *
   * @param {Object} user
   *
   * @return {String} Returned token
   */
  static token(user, secret) {
    const authToken = jwt.sign(
      user, secret,
      { expiresIn: '1d' },
    );

    return authToken;
  }
}

export default GenerateToken;
