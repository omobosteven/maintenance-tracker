import Controller from './Controller';
import db from '../models/db';

class AdminRequestsController extends Controller {
  /**
   * @description Fetch all the requests in the system
   *
   * @param {Object} request - HTTP Request
   * @param {Object} response - HTTP Response
   *
   * @return {Object} Returned object
   */
  static getAllRequests(req, res) {
    const queryFetchAllRequests =
    `SELECT * FROM requests
    ORDER BY requestid DESC`;

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


  /**
   * @description Fetch a request in the system
   *
   * @param {Object} request - HTTP Request
   * @param {Object} response - HTTP Response
   *
   * @return {Object} Returned object
   */
  static getRequest(req, res) {
    const { id } = req.params;

    const queryFetchRequest =
    `SELECT * FROM requests
    WHERE requestid = '${id}';`;

    db.connect()
      .then((client) => {
        client.query(queryFetchRequest)
          .then((request) => {
            if (request.rows.length < 1) {
              client.release();
              return res.status(404).json({
                status: 'fail',
                message: 'Request not found',
              });
            }

            client.release();
            return res.status(200).json({
              status: 'success',
              data: {
                request: request.rows[0],
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

  /**
   * @description Update a request status
   *
   * @param {Object} request - HTTP Request
   * @param {Object} response - HTTP Response
   *
   * @return {Object} Returned object
   */
  static updateRequestStatus(req, res) {
    const { id } = req.params;

    const statusUpdate = req.path.slice(req.path.lastIndexOf('/') + 1);

    let check;
    let update;

    switch (statusUpdate) {
      case 'approve':
        check = 'pending';
        update = 'approved';
        break;
      case 'disapprove':
        check = 'pending';
        update = 'disapproved';
        break;
      case 'resolve':
      default:
        check = 'approved';
        update = 'resolved';
    }

    const queryUpdateRequestStatus =
    `UPDATE requests
    SET status='${update}'
    WHERE requestid = '${id}' AND status = '${check}'
    RETURNING *`;

    db.connect()
      .then((client) => {
        client.query(queryUpdateRequestStatus)
          .then((request) => {
            if (request.rows.length < 1) {
              client.release();
              return res.status(404).json({
                status: 'fail',
                message: 'Request was not found',
              });
            }

            client.release();
            return res.status(200).json({
              status: 'success',
              message: `Request ${update}`,
              data: {
                request: request.rows[0],
              },
            });
          })
          .catch(() => {
            client.release();
            res.status(500).json({
              status: 'error',
              message: 'Failed to update request status',
            });
          });
      });
  }
}

export default AdminRequestsController;
