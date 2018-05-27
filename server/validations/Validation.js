/* eslint-disable class-methods-use-this */
import Validator from 'validatorjs';

class Validation {
  /**
   * @description Validates request params id
   *
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   *
   * @return {Function} next
   */
  static validateId(req, res, next) {
    const { id } = req.params;

    const validation = new Validator({
      id,
    }, {
      id: 'required|integer',
    }, {
      'integer.id': 'The request :attribute must be a number',
    });

    if (validation.passes()) {
      return next();
    }

    return res.status(400).json({
      status: 'fail',
      data: {
        errors: validation.errors.first('id'),
      },
    });
  }
}

export default Validation;
