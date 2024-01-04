// Registeration Request (Send OTPCode)
/**
 * @swagger
 * /api/users/auth/v1/registerationRequest:
 *  post:
 *      tags: [--Auth]
 *      summary: User request for registration
 *      requestBody:
 *          required: true
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: '#/components/schemas/RegisterationRequest'
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/RegisterationRequest'
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/definitions/Registeration_Request_Response'
 */

// Register (check OTPCode)
/**
 * @swagger
 * /api/users/auth/v1/register:
 *  post:
 *      tags: [--Auth]
 *      summary: User request for register
 *      requestBody:
 *          required: true
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: '#/components/schemas/Register'
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Register'
 *      responses:
 *          201:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/definitions/Register_Response'
 */
