// Info: Who am I?
/**
 * @swagger
 * /api/users/profile/v1/whoami:
 *  get:
 *      tags: [--Profile]
 *      summary: Check user is online, return his profile
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/definitions/WhoAmI_Response'
 *          401:
 *              description: UnAuthorized user
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/definitions/UnAuthorized_Response'
 *          500:
 *              description: Internal server error
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/definitions/Failed_Response_Server_Error'
 */

// Info: Find one user
/**
 * @swagger
 * /api/users/profile/v1/findOne:
 *  get:
 *      tags: [--Profile]
 *      summary: Find one user with conditions in query params
 *      parameters:
 *          -   in: query
 *              name: firstname
 *              type: string
 *              description: user firstname
 *          -   in: query
 *              name: lastname
 *              type: string
 *              description: user lastname
 *          -   in: query
 *              name: mobile
 *              type: string
 *              description: user mobile
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/definitions/WhoAmI_Response'
 *          401:
 *              description: UnAuthorized user
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/definitions/UnAuthorized_Response'
 *          500:
 *              description: Internal server error
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/definitions/Failed_Response_Server_Error'
 */
