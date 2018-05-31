/* eslint-disable class-methods-use-this */
import Validator from 'validatorjs';

class Validation {
  /**
   * @description Validates request params id
   *
   * @param {Object} request
   * @param {Object} response
   * @param {Function} next
   *
   * @return {Function} next
   */
  static validateId(request, response, next) {
    const { id } = request.params;

    Validator.register(
      'posInt', value => value > 0,
      'Invalid :attribute entered',
    );

    const validation = new Validator({
      id,
    }, {
      id: 'required|integer|posInt',
    }, {
      'integer.id': 'The request :attribute must be a number',
    });

    if (validation.passes()) {
      return next();
    }

    return response.status(400).json({
      status: 'fail',
      data: {
        errors: validation.errors.first('id'),
      },
    });
  }
}

export default Validation;
