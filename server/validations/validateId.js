/* eslint-disable class-methods-use-this */
import isNumber from 'is-number';

class Validation {
  /**
   * @description Validates request id
   *
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   *
   * @return {Function} next
   */
  validateId(req, res, next) {
    if (!isNumber(req.params.id)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Id is invalid',
      });
    }

    return next();
  }
}

const validation = new Validation();
export default validation;
