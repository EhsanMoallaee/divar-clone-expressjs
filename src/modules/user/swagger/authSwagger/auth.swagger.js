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
 *      summary: Rregister user
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

// Login Request (Send OTPCode)
/**
 * @swagger
 * /api/users/auth/v1/loginRequest:
 *  post:
 *      tags: [--Auth]
 *      summary: User request for login
 *      requestBody:
 *          required: true
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: '#/components/schemas/LoginRequest'
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/LoginRequest'
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/definitions/Login_Request_Response'
 */

// Login (check OTPCode)
/**
 * @swagger
 * /api/users/auth/v1/login:
 *  post:
 *      tags: [--Auth]
 *      summary: Login user
 *      requestBody:
 *          required: true
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: '#/components/schemas/Login'
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Login'
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/definitions/Login_Response'
 */

// Logout
/**
 * @swagger
 * /api/users/auth/v1/logout:
 *  post:
 *      tags: [--Auth]
 *      summary: logout user
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/definitions/Logout_Response'
 */
