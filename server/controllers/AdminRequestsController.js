import Controller from './Controller';
import db from '../models/db';

class AdminRequestsController extends Controller {
  /**
   * @description Fetch all the requests in the system
   *
   * @param {Object} req - HTTP Request
   * @param {Object} res - HTTP Response
   *
   * @return {Object} Returned object
   */
  static getAllRequests(req, res) {
    const queryFetchAllRequests = 'SELECT * FROM requests';

    db.connect()
      .then((client) => {
        client.query(queryFetchAllRequests)
          .then((requests) => {
            if (requests.rows.length < 1) {
              client.release();
              return res.status(404).json({
                status: 'fail',
                message: 'No request was found',
              });
            }

            client.release();
            return res.status(200).json({
              status: 'success',
              message: 'All Requests',
              data: {
                requests: requests.rows,
              },
            });
          })
          .catch(() => {
            client.release();
            return res.status(500).json({
              status: 'error',
              message: 'Failed to fetch requests',
            });
          });
      });
  }
}

export default AdminRequestsController;
