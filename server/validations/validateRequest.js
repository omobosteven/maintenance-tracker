import validator from 'validator/';
import isEmpty from 'lodash/isEmpty';

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
    const { body } = req;
    const errors = {};

    if (!body.type || validator.isEmpty(body.type.trim())) {
      errors.type = 'type is required';
    }

    if (body.type &&
       !validator.isIn(
         body.type.trim().toLowerCase(),
         ['repairs', 'maintenance'],
       )) {
      errors.type = 'type must be either of: repairs or maintenance';
    }

    if (!body.category || validator.isEmpty(body.category.trim())) {
      errors.category = 'category is required';
    }

    if (body.category && !validator.isAlpha(body.category.trim())) {
      errors.category = 'Enter alphabetic letters for category';
    }

    if (!body.item || validator.isEmpty(body.item.trim())) {
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
