// Info: Create New Parameter
/**
 * @swagger
 * /api/v1/advertise/parameter:
 *  post:
 *      tags: [--Parameter]
 *      summary: Create parameter
 *      requestBody:
 *          required: true
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: '#/components/schemas/CreateParameter'
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/CreateParameter'
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/definitions/Parameter_Response_Success'
 *          400:
 *              description: Bad request
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/definitions/Failed_Response_Client_Error'
 *          500:
 *              description: Internal server error
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/definitions/Failed_Response_Server_Error'
 */

// Info: Fetch All Parameters
/**
 * @swagger
 * /api/v1/advertise/parameter:
 *  get:
 *      tags: [--Parameter]
 *      summary: Fetch all parameters
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/definitions/ListOfParameters'
 *          400:
 *              description: Bad request
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/definitions/Failed_Response_Client_Error'
 *          500:
 *              description: Internal server error
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/definitions/Failed_Response_Server_Error'
 */

// Info: Find One Parameter By Id
/**
 * @swagger
 * /api/v1/advertise/parameter/by-id/{parameterId}:
 *  get:
 *      tags: [--Parameter]
 *      summary: Find parameter by id
 *      parameters:
 *          -   in: path
 *              name: parameterId
 *              type: string
 *              required: true
 *              description: Parameter id
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/definitions/Find_Parameter_Response_Success'
 *          400:
 *              description: Bad request
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/definitions/Failed_Response_Client_Error'
 *          404:
 *              description: Bad request
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/definitions/Not_Found_Response'
 *          500:
 *              description: Internal server error
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/definitions/Failed_Response_Server_Error'
 */

// Info: Find One Parameter By Category Id
/**
 * @swagger
 * /api/v1/advertise/parameter/by-category-id/{categoryId}:
 *  get:
 *      tags: [--Parameter]
 *      summary: Find parameter by category id
 *      parameters:
 *          -   in: path
 *              name: categoryId
 *              type: string
 *              required: true
 *              description: Parameter related category id
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/definitions/Find_Parameter_Response_Success'
 *          400:
 *              description: Bad request
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/definitions/Failed_Response_Client_Error'
 *          404:
 *              description: Bad request
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/definitions/Not_Found_Response'
 *          500:
 *              description: Internal server error
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/definitions/Failed_Response_Server_Error'
 */

// Info: Find One Parameter By Category Slug
/**
 * @swagger
 * /api/v1/advertise/parameter/by-category-slug/{categorySlug}:
 *  get:
 *      tags: [--Parameter]
 *      summary: Find parameter by category slug
 *      parameters:
 *          -   in: path
 *              name: categorySlug
 *              type: string
 *              required: true
 *              description: Parameter related category slug
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/definitions/Find_Parameter_By_Slug_Response_Success'
 *          400:
 *              description: Bad request
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/definitions/Failed_Response_Client_Error'
 *          404:
 *              description: Bad request
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/definitions/Not_Found_Response'
 *          500:
 *              description: Internal server error
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/definitions/Failed_Response_Server_Error'
 */

// Info: Delete One Parameter By Id
/**
 * @swagger
 * /api/v1/advertise/parameter/{parameterId}:
 *  delete:
 *      tags: [--Parameter]
 *      summary: Delete parameter by id
 *      parameters:
 *          -   in: path
 *              name: parameterId
 *              type: string
 *              required: true
 *              description: parameter id
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/definitions/Success_Response_With_Message'
 *          400:
 *              description: Bad request
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/definitions/Failed_Response_Client_Error'
 *          404:
 *              description: Bad request
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/definitions/Not_Found_Response'
 *          500:
 *              description: Internal server error
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/definitions/Failed_Response_Server_Error'
 */
