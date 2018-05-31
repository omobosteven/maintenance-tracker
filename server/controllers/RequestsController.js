/* eslint-disable class-methods-use-this, consistent-return */
import db from '../models/db';

class RequestsController {
  /**
   * @description Fetch all the requests of a logged in user
   *
   * @param {Object} request - HTTP Request
   * @param {Object} response - HTTP Response
   *
   * @return {Object} Returned object
   */
  static getAllRequests(request, response) {
    const { userid } = request.decoded;

    const queryGetAllRequestsForUser =
    `SELECT * FROM requests
    WHERE userid = '${userid}'
    ORDER BY requestid DESC;`;

    db.connect()
      .then((client) => {
        client.query(queryGetAllRequestsForUser)
          .then((userRequests) => {
            if (userRequests.rows.length < 1) {
              return response.status(404).json({
                status: 'fail',
                message: 'No request was found',
              });
            }

            client.release();
            return response.status(200).json({
              status: 'success',
              message: 'My Requests',
              data: {
                user: request.decoded.email,
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
   * @description Fetch a request of a logged in user
   *
   * @param {Object} request - HTTP Request
   * @param {Object} response - HTTP Response
   *
   * @return {Object} Returned object
   */
  static getRequest(request, response) {
    const { userid, email } = request.decoded;
    const { id } = request.params;

    const queryFetchRequest =
    `SELECT * FROM requests
    WHERE requestid = '${id}' 
    AND userid = '${userid}';`;

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
                user: email,
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
   * @description Create a request
   *
   * @param {Object} request - HTTP Request
   * @param {Object} response - HTTP Response
   *
   * @return {Object} Returned object
   */
  static createRequest(request, response) {
    let {
      type, category, item, description,
    } = request.body;

    const { userid } = request.decoded;
    type = type.trim().toLowerCase();
    category = category.trim().toLowerCase();
    item = item.trim().toLowerCase();
    description = description.trim().toLowerCase();

    const queryRequestDuplicate =
    `SELECT * FROM requests
     WHERE userid='${userid}' AND
     type='${type}' AND category='${category}' AND
     item='${item}' AND description='${description}' AND
     status='pending';`;

    const queryCreateRequest =
    `INSERT INTO requests
    (userId, type, category, item, description)
    VALUES
    (${userid}, '${type}', '${category}', '${item}', '${description}')
    RETURNING *`;

    db.connect()
      .then((client) => {
        client.query(queryRequestDuplicate)
          .then((duplicate) => {
            if (duplicate.rows[0]) {
              client.release();
              return response.status(409).json({
                status: 'fail',
                message: 'request already exist',
              });
            }

            client.query(queryCreateRequest)
              .then((requestsSaved) => {
                client.release();
                return response.status(201).json({
                  status: 'success',
                  message: 'request created successfully',
                  data: { request: requestsSaved.rows[0] },
                });
              })
              .catch(() => response.status(500).json({
                status: 'fail',
                message: 'Requests could not be created',
              }));
          })
          .catch(() => response.status(500).json({
            status: 'fail',
            message: 'Requests could not be created',
          }));
      });
  }

  /**
   * @description Modify a request
   *
   * @param {Object} req - HTTP Request
   * @param {Object} res - HTTP Response
   *
   * @return {Object} Returned object
   */
  static modifyRequest(request, response) {
    const { userid } = request.decoded;
    const { id } = request.params;

    const queryGetRequest =
   `SELECT * FROM requests
    WHERE userid = '${userid}' AND
    requestid = '${id}'`;

    db.connect()
      .then((client) => {
        client.query(queryGetRequest)
          .then((userRequest) => {
            if (!userRequest.rows[0]) {
              client.release();
              return response.status(404).json({
                status: 'fail',
                message: 'Request was not found',
              });
            }

            if (userRequest.rows[0].status !== 'pending') {
              return response.status(400).json({
                status: 'fail',
                message: 'Not allowed, requests has been processed',
              });
            }

            const requestUpdate = {
              ...userRequest.rows[0],
              ...request.body,
            };

            let {
              type, category, item, description,
            } = requestUpdate;

            type = type.trim().toLowerCase();
            category = category.trim().toLowerCase();
            item = item.trim().toLowerCase();
            description = description.trim().toLowerCase();

            const queryRequestDuplicate =
            `SELECT * FROM requests
             WHERE userid='${userid}' AND
             type='${type}' AND category='${category}' AND
             item='${item}' AND description='${description}' AND
             status='pending';`;

            const queryUpdateRequest =
            `UPDATE requests 
             SET type = '${type}', category= '${category}',
             item = '${item}', description = '${description}'
             WHERE requestid = '${id}'
             RETURNING *`;

            client.query(queryRequestDuplicate)
              .then((duplicate) => {
                if (duplicate.rows[0]) {
                  client.release();
                  return response.status(409).json({
                    status: 'fail',
                    message: 'request already exist',
                  });
                }

                client.query(queryUpdateRequest)
                  .then((updatedRequest) => {
                    client.release();
                    return response.status(200).json({
                      status: 'success',
                      message: 'request updated successfully',
                      data: {
                        request: updatedRequest.rows[0],
                      },
                    });
                  })
                  .catch((error) => {
                    client.release();
                    return response.status(500).json({
                      status: 'fail',
                      message: 'Failed to update request',
                      error: error.message,
                    });
                  });
              })
              .catch();
          })
          .catch(() => {
            client.release();
            return response.status(500).json({
              status: 'fail',
              message: 'Failed to retrieve request, Internal server error',
            });
          });
      });
  }
}

export default RequestsController;
