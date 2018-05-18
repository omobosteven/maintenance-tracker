import Controller from './Controller';
import requests from '../dummy-data/requests';

class RequestsController extends Controller {
  /**
   * @description Fetch all the requests of a logged in user
   *
   * @param {Object} req - HTTP Request
   * @param {Object} res - HTTP Response
   *
   * @return {Object} Returned object
   */
  static getRequests(req, res) {
    if (requests.length < 1) {
      return res.status(404).json({
        message: 'No request was found',
      });
    }

    return res.status(200).json({
      message: 'My Requests',
      requests,
    });
  }

  /**
   * @description Fetch a request of a logged in user
   *
   * @param {Object} req - HTTP Request
   * @param {Object} res - HTTP Response
   *
   * @return {(json)}JSON object
   */
  static getRequest(req, res) {
    const requestDetails = requests.find(request =>
      parseInt(request.id, 10) === parseInt(req.params.id, 10));

    if (!requestDetails) {
      return res.status(404).json({
        status: 'fail',
        message: 'Request not found',
      });
    }

    return res.status(200).json({
      status: 'success',
      data: {
        request: requestDetails,
      },
    });
  }

  /**
   * @description Create a request
   *
   * @param {Object} req - HTTP Request
   * @param {Object} res - HTTP Response
   *
   * @return {(json)}JSON object
   */
  static createRequest(req, res) {
    const {
      type, category, item, description,
    } = req.body;

    const id = requests.length + 1;

    let descriptionValue = 'no-description';
    if (description) {
      descriptionValue = description.trim().toLowerCase();
    }

    const request = {
      id,
      userId: 1,
      type: type.trim().toLowerCase(),
      category: category.trim().toLowerCase(),
      item: item.trim().toLowerCase(),
      description: descriptionValue,
      status: 'new',
    };

    requests.push(request);

    return res.status(201).json({
      status: 'success',
      message: 'request created successfully',
      data: { request },
    });
  }

  /**
   * @description Modify a request
   *
   * @param {Object} req - HTTP Request
   * @param {Object} res - HTTP Response
   *
   * @return {(json)}JSON object
   */
  static modifyRequest(req, res) {
    const { body } = req;

    const requestIndex = requests
      .findIndex(request => request.id === parseInt(req.params.id, 10));

    if (requestIndex < 0) {
      return res.status(404).json({
        status: 'fail',
        message: 'Request was not found',
      });
    }

    const {
      id, userId, type, category, item, description, status,
    } = requests[requestIndex];

    const requestUpdate = {
      type: body.type || type,
      category: body.category || category,
      item: body.item || item,
      description: body.description || description,
    };

    requests[requestIndex] = {
      id,
      userId,
      type: requestUpdate.type.trim().toLowerCase(),
      category: requestUpdate.category.trim().toLowerCase(),
      item: requestUpdate.item.trim().toLowerCase(),
      description: requestUpdate.description.trim().toLowerCase(),
      status,
    };

    return res.status(200).json({
      status: 'success',
      message: 'request updated successfully',
      data: {
        request: requests[requestIndex],
      },
    });
  }
}

export default RequestsController;
