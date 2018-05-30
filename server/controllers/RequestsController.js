/* eslint-disable class-methods-use-this, consistent-return */
import Controller from './Controller';
import db from '../models/db';

class RequestsController extends Controller {
  /**
   * @description Fetch all the requests of a logged in user
   *
   * @param {Object} request - HTTP Request
   * @param {Object} response - HTTP Response
   *
   * @return {Object} Returned object
   */
  static getAllRequests(req, res) {
    const { userid } = req.decoded;

    const queryGetAllRequestsForUser =
    `SELECT * FROM requests
    WHERE userid = '${userid}'
    ORDER BY requestid DESC;`;

    db.connect()
      .then((client) => {
        client.query(queryGetAllRequestsForUser)
          .then((userRequests) => {
            if (userRequests.rows.length < 1) {
              return res.status(404).json({
                status: 'fail',
                message: 'No request was found',
              });
            }

            client.release();
            return res.status(200).json({
              status: 'success',
              message: 'My Requests',
              data: {
                user: req.decoded.email,
                requests: userRequests.rows,
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
   * @description Fetch a request of a logged in user
   *
   * @param {Object} request - HTTP Request
   * @param {Object} response - HTTP Response
   *
   * @return {Object} Returned object
   */
  static getRequest(req, res) {
    const { userid, email } = req.decoded;
    const { id } = req.params;

    const queryFetchRequest =
    `SELECT * FROM requests
    WHERE requestid = '${id}' 
    AND userid = '${userid}';`;

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
                user: email,
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
   * @description Create a request
   *
   * @param {Object} request - HTTP Request
   * @param {Object} response - HTTP Response
   *
   * @return {Object} Returned object
   */
  static createRequest(req, res) {
    let {
      type, category, item, description,
    } = req.body;

    const { userid } = req.decoded;
    type = type.trim().toLowerCase();
    category = category.trim().toLowerCase();
    item = item.trim().toLowerCase();
    description = description.trim().toLowerCase();

    const queryCreateRequest =
    `INSERT INTO requests
    (userId, type, category, item, description)
    VALUES
    (${userid}, '${type}', '${category}', '${item}', '${description}')
    RETURNING *`;

    db.connect()
      .then((client) => {
        client.query(queryCreateRequest)
          .then((requestsSaved) => {
            client.release();
            return res.status(201).json({
              status: 'success',
              message: 'request created successfully',
              data: { request: requestsSaved.rows[0] },
            });
          })
          .catch(() => res.status(500).json({
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
  static modifyRequest(req, res) {
    const { userid } = req.decoded;
    const { id } = req.params;

    const queryGetRequest =
   `SELECT * FROM requests
    WHERE userid = '${userid}' AND
    requestid = '${id}'`;

    db.connect()
      .then((client) => {
        client.query(queryGetRequest)
          .then((request) => {
            if (!request.rows[0]) {
              client.release();
              return res.status(404).json({
                status: 'fail',
                message: 'Request was not found',
              });
            }

            if (request.rows[0].status !== 'pending') {
              return res.status(405).json({
                status: 'fail',
                message: 'Not allowed, requests has been processed',
              });
            }

            const requestUpdate = {
              ...request.rows[0],
              ...req.body,
            };

            let {
              type, category, item, description,
            } = requestUpdate;

            type = type.trim().toLowerCase();
            category = category.trim().toLowerCase();
            item = item.trim().toLowerCase();
            description = description.trim().toLowerCase();

            const queryUpdateRequest =
            `UPDATE requests 
             SET type = '${type}', category= '${category}',
             item = '${item}', description = '${description}'
             WHERE requestid = '${id}'
             RETURNING *`;

            client.query(queryUpdateRequest)
              .then((updatedRequest) => {
                client.release();
                return res.status(200).json({
                  status: 'success',
                  message: 'request updated successfully',
                  data: {
                    request: updatedRequest.rows[0],
                  },
                });
              })
              .catch(() => {
                client.release();
                return res.status(500).json({
                  status: 'fail',
                  message: 'Failed to update request, Internal server error',
                });
              });
          })
          .catch(() => {
            client.release();
            return res.status(500).json({
              status: 'fail',
              message: 'Failed to retrieve request, Internal server error',
            });
          });
      });
  }
}

export default RequestsController;
