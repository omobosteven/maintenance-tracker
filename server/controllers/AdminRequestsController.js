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
    `SELECT "requestId",
    "Requests"."userId", email, type, category,
     item, description, status, "Requests"."createdAt" FROM "Requests"
    INNER JOIN "Users" ON "Requests"."userId" = "Users"."userId"
    INNER JOIN "RequestStatus" ON "Requests"."statusId" = "RequestStatus"."statusId"
    INNER JOIN "RequestTypes" ON "Requests"."typeId" = "RequestTypes"."typeId"
    ORDER BY "requestId" DESC;`;

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
    `SELECT "requestId",
    "Requests"."userId", email, type, category,
     item, description, status, "Requests"."createdAt" FROM "Requests"
    INNER JOIN "Users" ON "Requests"."userId" = "Users"."userId"
    INNER JOIN "RequestStatus" ON "Requests"."statusId" = "RequestStatus"."statusId"
    INNER JOIN "RequestTypes" ON "Requests"."typeId" = "RequestTypes"."typeId"
    WHERE "requestId" = '${id}';`;

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

    const { statusId } = request.userRequest.rows[0];

    if (statusId === 4) {
      return response.status(422).json({
        status: 'fail',
        message: 'Request has already been resolved',
      });
    }

    if (statusId === 2) {
      return response.status(422).json({
        status: 'fail',
        message: 'Request has already been approved',
      });
    }

    const queryUpdateRequestStatus =
    `UPDATE "Requests"
    SET "statusId"=2
    FROM "Users"
    WHERE "Users"."userId" = "Requests"."userId" AND "requestId" = '${id}'
    RETURNING email, "Requests".*;`;

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

    const { statusId } = request.userRequest.rows[0];

    if (statusId === 4) {
      return response.status(422).json({
        status: 'fail',
        message: 'Request has already been resolved',
      });
    }

    if (statusId === 3) {
      return response.status(422).json({
        status: 'fail',
        message: 'Request has already been disapproved',
      });
    }

    const queryUpdateRequestStatus =
    `UPDATE "Requests"
    SET "statusId"=3
    FROM "Users"
    WHERE "Requests"."userId" = "Users"."userId" AND "requestId" = '${id}'
    RETURNING email, "Requests".*;`;

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

    const { statusId } = request.userRequest.rows[0];

    if (statusId === 4) {
      return response.status(422).json({
        status: 'fail',
        message: 'Request has already been resolved',
      });
    }

    if (statusId !== 2) {
      return response.status(422).json({
        status: 'fail',
        message: 'Request is not approved',
      });
    }

    const queryUpdateRequestStatus =
    `UPDATE "Requests"
    SET "statusId"=4
    FROM "Users"
    WHERE "Requests"."userId" = "Users"."userId" AND "requestId" = '${id}'
    RETURNING email, "Requests".*;`;

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
