import validator from 'validator/';
import isEmpty from 'lodash/isEmpty';
import isNumber from 'is-number';
import Validator from 'validatorjs';

class ValidateRequest {
  /**
   * @description Validates create request inputs
   *
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   *
   * @return {Function} next
   */
  static create(req, res, next) {
    const {
      type, category, description, item,
    } = req.body;

    const data = {
      type,
      category,
      description,
      item,
    };

    const rules = {
      type: ['required', { in: ['repair', 'maintenance'] }],
      category: 'required|max:50',
      description: 'required|min:10|max:100',
      item: 'required|max:50',
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
  }

  /**
   * @description Validates modify request inputs
   *
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   *
   * @return {Function} next
   */
  static modify(req, res, next) {
    const { body } = req;
    const errors = {};

    if (!isNumber(req.params.id)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Id is invalid',
      });
    }

    if (!body.type && !body.category && !body.item && !body.description) {
      errors.message = 'Enter a field to update';
    }

    if (body.type && validator.isEmpty(body.type.trim())) {
      errors.type = 'type is required';
    }

    if (body.type &&
      !validator.isIn(
        body.type.trim().toLowerCase(),
        ['repairs', 'maintenance'],
      )) {
      errors.type = 'type must be either of: repairs or maintenance';
    }

    if (body.category && validator.isEmpty(body.category.trim())) {
      errors.category = 'category is required';
    }

    if (body.category && !validator.isAlpha(body.category.trim())) {
      errors.category = 'Enter alphabetic letters for category';
    }

    if (body.item && validator.isEmpty(body.item.trim())) {
      errors.item = 'item is required';
    }

    if (body.item && !validator.isAlpha(body.item.trim())) {
      errors.item = 'Enter alphabetic letters for Item';
    }

    if (body.description &&
      !validator.isLength(body.description.trim(), { min: 5 })) {
      errors.description = 'description is too short';
    }

    const isValid = isEmpty(errors);
    if (!isValid) {
      return res.status(400).json({
        status: 'fail',
        data: { errors },
      });
    }

    return next();
  }
}

export default ValidateRequest;
