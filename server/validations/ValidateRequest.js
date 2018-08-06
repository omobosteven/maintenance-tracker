import Validator from 'validatorjs';

class ValidateRequest {
  /**
   * @description Validates create request inputs
   *
   * @param {Object} request
   * @param {Object} response
   * @param {Function} next
   *
   * @return {Function} next
   */
  static create(request, response, next) {
    const {
      type, category, description, item,
    } = request.body;

    const data = {
      type: (type && type.trim()),
      category: (category && category.trim().toLowerCase()),
      description: (description && description.trim().toLowerCase()),
      item: (item && item.trim().toLowerCase()),
    };

    const rules = {
      type: ['required', { in: ['1', '2'] }],
      category: 'required|max:20',
      item: 'required|min:2|max:50',
      description: 'required|min:10|max:50',
    };

    const validation = new Validator(data, rules, {
      'in.type': ':attribute field must be either of 1 - repair or 2 - maintenance',
    });

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
   * @description Validates modify request inputs
   *
   * @param {Object} request
   * @param {Object} response
   * @param {Function} next
   *
   * @return {Function} next
   */
  static modify(request, response, next) {
    const {
      type, category, description, item,
    } = request.body;

    if (!type && !category && !item && !description) {
      return response.status(400).json({
        status: 'fail',
        message: 'Enter a field to update',
      });
    }

    const data = {
      type,
      category,
      description,
      item,
    };

    const rules = {
      type: ['required_with:type', { in: ['1', '2'] }],
      category: 'required_with:category|max:20',
      item: 'required_with:item|min:2|max:15',
      description: 'required_with:description|min:10|max:50',
    };

    const validation = new Validator(data, rules, {
      'required_with.type': 'The :attribute field cannot be empty',
      'required_with.category': 'The :attribute field cannot be empty',
      'required_with.item': 'The :attribute field cannot be empty',
      'required_with.description': 'The :attribute field cannot be empty',
      'in.type': ':attribute field must be either of 1:repair or 2:maintenance',
    });

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

export default ValidateRequest;
