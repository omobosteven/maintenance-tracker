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

    const validation = new Validator(data, rules, {
      'in.type': ':attribute must be either of repair or maintenance',
    });

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
    const {
      type, category, description, item,
    } = req.body;
    const { id } = req.params;

    if (!type && !category && !item && !description) {
      return res.status(400).json({
        status: 'fail',
        message: 'Enter a field to update',
      });
    }

    const data = {
      id, type, category, item, description,
    };

    const rules = {
      id: 'required|integer',
      type: ['required_with:type', { in: ['repair', 'maintenance'] }],
      category: 'required_with:category|max:50',
      description: 'required_with:description|min:8|max:100',
      item: 'required_with:item|min:2|max:50',
    };

    const validation = new Validator(data, rules, {
      'required_with.type': 'The :attribute field cannot be empty',
      'required_with.category': 'The :attribute field cannot be empty',
      'required_with.item': 'The :attribute field cannot be empty',
      'required_with.description': 'The :attribute field cannot be empty',
      'integer.id': 'The request :attribute must be a number',
      'in.type': ':attribute must be either of repair or maintenance',
    });

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
}

export default ValidateRequest;
