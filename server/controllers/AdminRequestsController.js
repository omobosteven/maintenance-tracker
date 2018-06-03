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
    `SELECT email,requests.* FROM requests
     INNER JOIN users ON requests.userid = users.userid
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
    `SELECT email, requests.*
     FROM requests
     INNER JOIN users ON requests.userid = users.userid
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
   * @description Approve a request status
   *
   * @param {Object} request - HTTP Request
   * @param {Object} response - HTTP Response
   *
   * @return {Object} Returned object
   */
  static approveRequest(request, response) {
    const { id } = request.params;

    const { status } = request.userRequest.rows[0];

    if (status === 'resolved') {
      return response.status(400).json({
        status: 'fail',
        message: 'Request has already been resolved',
      });
    }

    if (status === 'approved') {
      return response.status(400).json({
        status: 'fail',
        message: 'Request has already been approved',
      });
    }

    const queryUpdateRequestStatus =
    `UPDATE requests
    SET status='approved'
    FROM users
    WHERE requests.userid = users.userid AND requestid = '${id}'
    RETURNING email, requests.*;`;

    db.connect()
      .then((client) => {
        client.query(queryUpdateRequestStatus)
          .then((updatedRequest) => {
            client.release();
            return response.status(200).json({
              status: 'success',
              message: 'Request Approved',
              data: {
                request: updatedRequest.rows[0],
              },
            });
          })
          .catch((error) => {
            client.release();
            response.status(500).json({
              status: 'error',
              message: 'Failed to update request status',
              error: error.message,
            });
          });
      });
  }

  /**
   * @description dispprove a request status
   *
   * @param {Object} request - HTTP Request
   * @param {Object} response - HTTP Response
   *
   * @return {Object} Returned object
   */
  static disapproveRequest(request, response) {
    const { id } = request.params;

    const { status } = request.userRequest.rows[0];

    if (status === 'resolved') {
      return response.status(400).json({
        status: 'fail',
        message: 'Request has already been resolved',
      });
    }

    if (status === 'disapproved') {
      return response.status(400).json({
        status: 'fail',
        message: 'Request has already been disapproved',
      });
    }

    const queryUpdateRequestStatus =
    `UPDATE requests
    SET status='disapproved'
    FROM users
    WHERE requests.userid = users.userid AND requestid = '${id}'
    RETURNING email, requests.*;`;

    db.connect()
      .then((client) => {
        client.query(queryUpdateRequestStatus)
          .then((updatedRequest) => {
            client.release();
            return response.status(200).json({
              status: 'success',
              message: 'Request Disapproved',
              data: {
                request: updatedRequest.rows[0],
              },
            });
          })
          .catch((error) => {
            client.release();
            response.status(500).json({
              status: 'error',
              message: 'Failed to update request status',
              error: error.message,
            });
          });
      });
  }

  /**
   * @description resolved a request status
   *
   * @param {Object} request - HTTP Request
   * @param {Object} response - HTTP Response
   *
   * @return {Object} Returned object
   */
  static reolveRequest(request, response) {
    const { id } = request.params;

    const { status } = request.userRequest.rows[0];

    if (status === 'resolved') {
      return response.status(400).json({
        status: 'fail',
        message: 'Request has already been resolved',
      });
    }

    if (status !== 'approved') {
      return response.status(400).json({
        status: 'fail',
        message: 'Request is not approved',
      });
    }

    const queryUpdateRequestStatus =
    `UPDATE requests
    SET status='resolved'
    FROM users
    WHERE requests.userid = users.userid AND requestid = '${id}'
    RETURNING email, requests.*;`;

    db.connect()
      .then((client) => {
        client.query(queryUpdateRequestStatus)
          .then((updatedRequest) => {
            client.release();
            return response.status(200).json({
              status: 'success',
              message: 'Request Resolved',
              data: {
                request: updatedRequest.rows[0],
              },
            });
          })
          .catch((error) => {
            client.release();
            response.status(500).json({
              status: 'error',
              message: 'Failed to update request status',
              error: error.message,
            });
          });
      });
  }
}

export default AdminRequestsController;
