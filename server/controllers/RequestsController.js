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
    const { userId } = request.decoded;

    const queryGetAllRequestsForUser =
    `SELECT "requestId",
     "Requests"."userId", ref_no, email, type, category,
      item, description, status, "Requests"."createdAt" FROM "Requests"
    INNER JOIN "Users" ON "Requests"."userId" = "Users"."userId"
    INNER JOIN "RequestStatus" ON "Requests"."statusId" = "RequestStatus"."statusId"
    INNER JOIN "RequestTypes" ON "Requests"."typeId" = "RequestTypes"."typeId"
    WHERE "Requests"."userId" = '${userId}'
    ORDER BY "requestId" DESC;`;

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
    const { userId } = request.decoded;
    const { id } = request.params;

    const queryFetchRequest =
    `SELECT  "requestId",
    "Requests"."userId", ref_no, email, type, category,
     item, description, status, "Requests"."createdAt" FROM "Requests"
    INNER JOIN "Users" ON "Requests"."userId" = "Users"."userId"
    INNER JOIN "RequestStatus" ON "Requests"."statusId" = "RequestStatus"."statusId"
    INNER JOIN "RequestTypes" ON "Requests"."typeId" = "RequestTypes"."typeId"
    WHERE "requestId" = '${id}' 
    AND "Requests"."userId" = '${userId}';`;

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

    const { userId } = request.decoded;
    type = type.trim().toLowerCase();
    category = category.trim().toLowerCase();
    item = item.trim().toLowerCase();
    description = description.trim().toLowerCase();

    const queryRequestDuplicate =
    `SELECT * FROM "Requests"
     WHERE "userId"='${userId}' AND
     "typeId"='${type}' AND category='${category}' AND
     item='${item}' AND description='${description}' AND
     "statusId"=1;`;

    const queryCreateRequest =
    `INSERT INTO "Requests"
    ("userId", "typeId", category, item, description)
    VALUES
    (${userId}, '${type}', '${category}', '${item}', '${description}')
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
    const { userId } = request.decoded;
    const { id } = request.params;

    const queryGetRequest =
   `SELECT * FROM "Requests"
    WHERE "userId" = '${userId}' AND
    "requestId" = '${id}'`;

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

            if (userRequest.rows[0].statusId !== 1) {
              return response.status(422).json({
                status: 'fail',
                message: 'Not allowed, request has been processed',
              });
            }

            const requestUpdate = {
              ...userRequest.rows[0],
              ...request.body,
            };

            let {
              type, category, item, description,
            } = requestUpdate;

            type = type.trim();
            category = category.trim().toLowerCase();
            item = item.trim().toLowerCase();
            description = description.trim().toLowerCase();

            const queryRequestDuplicate =
            `SELECT * FROM "Requests"
             WHERE "userId"='${userId}' AND
             "typeId"='${type}' AND category='${category}' AND
             item='${item}' AND description='${description}' AND
             "statusId"=1;`;

            const queryUpdateRequest =
            `UPDATE "Requests"
             SET "typeId" = '${type}', category= '${category}',
             item = '${item}', description = '${description}'
             WHERE "requestId" = '${id}'
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
              .catch(e => e.message);
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
