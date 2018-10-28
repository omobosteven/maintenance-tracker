/* eslint-disable class-methods-use-this */
import Validator from 'validatorjs';

class ValidateUser {
  /**
   * @description Validates create user inputs
   *
   * @param {Object} request
   * @param {Object} response
   * @param {Function} next
   *
   * @return {Function} next
   */
  static userInput(request, response, next) {
    const { username, email, password } = request.body;

    const data = {
      username,
      email,
      password,
    };

    const rules = {
      username: 'required|alpha_dash|min:2|max:20',
      email: 'required|email',
      password: 'required|min:6',
    };

    const validation = new Validator(data, rules);

    if (validation.passes()) {
      return next();
    }

    return response.status(400).json({
      status: 'fail',
      data: {
        errors: validation.errors.all(),
      },
    });
  }

  /**
   * @description Validates create user inputs on login
   *
   * @param {Object} request
   * @param {Object} response
   * @param {Function} next
   *
   * @return {Function} next
   */
  static userInputLogin(request, response, next) {
    const { email, password } = request.body;

    const data = {
      email,
      password,
    };

    const rules = {
      email: 'required|email',
      password: 'required',
    };

    const validation = new Validator(data, rules);

    if (validation.passes()) {
      return next();
    }

    return response.status(400).json({
      status: 'fail',
      data: {
        errors: validation.errors.all(),
      },
    });
  }
}

export default ValidateUser;

