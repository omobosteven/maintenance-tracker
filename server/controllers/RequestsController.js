import Controller from './Controller';
import requests from '../dummy-data/requests';

class RequestController extends Controller {
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
}

export default RequestController;
