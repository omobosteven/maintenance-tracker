/* eslint-disable class-methods-use-this */
import Validator from 'validatorjs';

/**
   * @description Validates create user inputs
   *
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   *
   * @return {Function} next
   */
const validateUser = (req, res, next) => {
  const { email, password } = req.body;

  const data = {
    emailAddress: email.trim(),
    password: password.trim(),
  };

  const rules = {
    emailAddress: 'required|email',
    password: 'required|min:8',
  };

  const validation = new Validator(data, rules);

  if (validation.passes()) {
    return next();
  }

  return res.status(400).json({
    status: 'fail',
    data: {
      errors: validation.errors.all(),
    },
  });
};

export default validateUser;

