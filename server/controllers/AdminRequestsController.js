/* eslint-disable class-methods-use-this, consistent-return */
import db from '../models/db';

class AdminRequestsController {
  /**
   * @description Fetch all the requests in the system
   *
   * @param {Object} request - HTTP Request
   * @param {Object} response - HTTP Response
   *
   * @return {Object} Returned object
   */
  static getAllRequests(request, response) {
    const queryFetchAllRequests =
    `SELECT * FROM requests
    ORDER BY requestid DESC`;

    db.connect()
      .then((client) => {
        client.query(queryFetchAllRequests)
          .then((userRequests) => {
            if (userRequests.rows.length < 1) {
              client.release();
              return response.status(200).json({
                status: 'success',
                message: 'No request was found',
              });
            }

            client.release();
            return response.status(200).json({
              status: 'success',
              message: 'All Requests',
              data: {
                requests: userRequests.rows,
              },
            });
          })
          .catch(() => {
            client.release();
            return response.status(500).json({
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
  static getRequest(request, response) {
    const { id } = request.params;

    const queryFetchRequest =
    `SELECT * FROM requests
    WHERE requestid = '${id}';`;

    db.connect()
      .then((client) => {
        client.query(queryFetchRequest)
          .then((userRequest) => {
            if (userRequest.rows.length < 1) {
              client.release();
              return response.status(404).json({
                status: 'fail',
                message: 'Request not found',
              });
            }

            client.release();
            return response.status(200).json({
              status: 'success',
              data: {
                request: userRequest.rows[0],
              },
            });
          })
          .catch(() => {
            client.release();
            return response.status(500).json({
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
  static updateRequestStatus(request, response) {
    const { id } = request.params;

    const statusUpdate = request.path.slice(request.path.lastIndexOf('/') + 1);

    let check;
    let update;
    let message;

    switch (statusUpdate) {
      case 'approve':
        check = 'pending';
        update = 'approved';
        message = 'Request has been processed';
        break;
      case 'disapprove':
        check = 'pending';
        update = 'disapproved';
        message = 'Request has been processed';
        break;
      case 'resolve':
      default:
        check = 'approved';
        update = 'resolved';
        message = 'Request has not been approved';
    }

    const queryFetchRequest =
    `SELECT * FROM requests
    WHERE requestid = '${id}';`;

    const queryUpdateRequestStatus =
    `UPDATE requests
    SET status='${update}'
    WHERE requestid = '${id}'
    RETURNING *;`;

    db.connect()
      .then((client) => {
        client.query(queryFetchRequest)
          .then((userRequest) => {
            if (!userRequest.rows[0]) {
              client.release();
              return response.status(404).json({
                status: 'fail',
                message: 'Request was not found',
              });
            }

            const { status } = userRequest.rows[0];

            if (status !== check) {
              return response.status(400).json({
                status: 'fail',
                message,
              });
            }

            client.query(queryUpdateRequestStatus)
              .then((updatedRequest) => {
                client.release();
                return response.status(200).json({
                  status: 'success',
                  message: `Request ${update}`,
                  data: {
                    request: updatedRequest.rows[0],
                  },
                });
              })
              .catch(() => {
                client.release();
                response.status(500).json({
                  status: 'error',
                  message: 'Failed to update request status',
                });
              });
          })
          .catch(() => {
            client.release();
            response.status(500).json({
              status: 'error',
              message: 'Failed to fetch request',
            });
          });
      });
  }
}

export default AdminRequestsController;
