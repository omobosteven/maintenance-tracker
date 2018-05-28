import Controller from './Controller';
import db from '../models/db';
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
        status: 'fail',
        message: 'No request was found',
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'My Requests',
      data: {
        requests,
      },
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

            return client.query(queryUpdateRequest)
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
