import db from '../models/db';

class AdminUsersController {
  /**
   * @description Method to get details of a user
   *
   * @param {Object} request - HTTP Request
   * @param {Object} response - HTTP Response
   *
   * @return {Object} Returned object
   */
  static userDetails(request, response) {
    const { id } = request.params;

    const queryGetUserDetails =
    `SELECT "userId", email, "roleId"
    FROM "Users"
    WHERE "userId" = '${id}';
    `;

    db.connect()
      .then((client) => {
        client.query(queryGetUserDetails)
          .then((userDetails) => {
            if (userDetails.rows.length < 1) {
              client.release();
              return response.status(404).json({
                status: 'fail',
                message: 'User not found',
              });
            }

            client.release();
            return response.status(200).json({
              status: 'success',
              data: {
                user: userDetails.rows[0],
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
   * @description Method to get details of all users
   *
   * @param {Object} request - HTTP Request
   * @param {Object} response - HTTP Response
   *
   * @return {Object} Returned object
   */
  static getAllUsersDetails(request, response) {
    const queryGetAllUsersDetails =
    `SELECT "userId", email, "roleId"
    FROM "Users";
    `;

    db.connect()
      .then((client) => {
        client.query(queryGetAllUsersDetails)
          .then((usersDetails) => {
            if (usersDetails.rows.length < 1) {
              client.release();
              return response.status(404).json({
                status: 'fail',
                message: 'User not found',
              });
            }

            client.release();
            return response.status(200).json({
              status: 'success',
              data: {
                users: usersDetails.rows,
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
}

export default AdminUsersController;
