import db from '../models/db';

class AdminRequests {
  /**
   * @description Method to check for request
   *
   * @param {Object} user
   *
   * @return {String} Returned token
   */
  static fetchRequest(request, response, next) {
    const { id } = request.params;

    const queryFetchRequest =
    `SELECT * FROM requests
    WHERE requestid = '${id}';`;

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

            client.release();
            request.userRequest = userRequest;
            return next();
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

export default AdminRequests;
