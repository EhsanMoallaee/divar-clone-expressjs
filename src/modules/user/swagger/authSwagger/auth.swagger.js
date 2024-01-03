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
 *                      $ref: '#/components/schemas/RegistrationRequest'
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/RegistrationRequest'
 *      responses:
 *          200:
 *              description: Success
 */
