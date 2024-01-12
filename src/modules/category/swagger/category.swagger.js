// Info: Create New Category
/**
 * @swagger
 * /api/v1/category:
 *  post:
 *      tags: [Category]
 *      summary: Create category
 *      requestBody:
 *          required: true
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: '#/components/schemas/CreateCategory'
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/CreateCategory'
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/definitions/Category_Response_Success'
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

// Info: Fetch All Categories
/**
 * @swagger
 * /api/v1/category:
 *  get:
 *      tags: [Category]
 *      summary: Fetch all categories
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/definitions/ListOfCategories'
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

// Info: Find One Category By Id
/**
 * @swagger
 * /api/v1/category/by-id/{catId}:
 *  get:
 *      tags: [Category]
 *      summary: Find category by id
 *      parameters:
 *          -   in: path
 *              name: catId
 *              type: string
 *              required: true
 *              description: Category id
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/definitions/Category_Response_Success'
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

// Info: Find One Category By Slug
/**
 * @swagger
 * /api/v1/category/by-slug/{slug}:
 *  get:
 *      tags: [Category]
 *      summary: Find category by slug
 *      parameters:
 *          -   in: path
 *              name: slug
 *              type: string
 *              required: true
 *              description: Category slug
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/definitions/Category_Response_Success'
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

// Info: Delete One Category By Id
/**
 * @swagger
 * /api/v1/category/{catId}:
 *  delete:
 *      tags: [Category]
 *      summary: Delete category by id
 *      parameters:
 *          -   in: path
 *              name: catId
 *              type: string
 *              required: true
 *              description: Category slug
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/definitions/Success_Response_Without_Message'
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
