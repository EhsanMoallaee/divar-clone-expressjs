// Info: Create New Post
/**
 * @swagger
 * /api/v1/advertise/post:
 *  post:
 *      tags: [--Post]
 *      summary: Create post
 *      requestBody:
 *          required: true
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: '#/components/schemas/CreatePost'
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/CreatePost'
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/definitions/Post_Response_Success'
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

// Info: Find One Post By Id
/**
 * @swagger
 * /api/v1/advertise/post/by-id/{postId}:
 *  get:
 *      tags: [--Post]
 *      summary: Find post by id
 *      parameters:
 *          -   in: path
 *              name: postId
 *              type: string
 *              required: true
 *              description: Post id
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/definitions/Find_Post_Response_Success'
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

// Info: Find One Post By Category Slug
/**
 * @swagger
 * /api/v1/advertise/post/by-category-slug/{categorySlug}:
 *  get:
 *      tags: [--Post]
 *      summary: Find post by category slug
 *      parameters:
 *          -   in: path
 *              name: categorySlug
 *              type: string
 *              required: true
 *              description: Post category slug
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/definitions/Find_Post_Response_Success'
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

// Info: Find One Post By Address
/**
 * @swagger
 * /api/v1/advertise/post/by-address:
 *  get:
 *      tags: [--Post]
 *      summary: Find post by address
 *      parameters:
 *          -   in: query
 *              name: province
 *              type: string
 *              required: true
 *              description: Province of advertise posts
 *          -   in: query
 *              name: city
 *              type: string
 *              description: City of advertise posts
 *          -   in: query
 *              name: district
 *              type: string
 *              description: District of advertise posts
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/definitions/Find_Array_Of_Posts_Response_Success'
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

// Info: Find One Post By Category Slug And Address
/**
 * @swagger
 * /api/v1/advertise/post/by-categorySlug-address:
 *  get:
 *      tags: [--Post]
 *      summary: Find post by category slug and address
 *      parameters:
 *          -   in: query
 *              name: categorySlug
 *              type: string
 *              required: true
 *              description: Category slug of advertise posts
 *          -   in: query
 *              name: province
 *              type: string
 *              required: true
 *              description: Province of advertise posts
 *          -   in: query
 *              name: city
 *              type: string
 *              description: City of advertise posts
 *          -   in: query
 *              name: district
 *              type: string
 *              description: District of advertise posts
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/definitions/Find_Array_Of_Posts_Response_Success'
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

// Info: Fetch All Posts
/**
 * @swagger
 * /api/v1/advertise/post:
 *  get:
 *      tags: [--Post]
 *      summary: Fetch all posts
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/definitions/Find_Array_Of_Posts_Response_Success'
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

// Info: Find User Own Posts
/**
 * @swagger
 * /api/v1/advertise/post/my-posts:
 *  get:
 *      tags: [--Post]
 *      summary: Find user own posts
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/definitions/Find_Array_Of_Posts_Response_Success'
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
 * /api/v1/advertise/post/{postId}:
 *  delete:
 *      tags: [--Post]
 *      summary: Delete post by id
 *      parameters:
 *          -   in: path
 *              name: postId
 *              type: string
 *              required: true
 *              description: post id
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

// Info: Confirm One Post By Id
/**
 * @swagger
 * /api/v1/advertise/post/confirm-post/{postId}:
 *  patch:
 *      tags: [--Post]
 *      summary: Confirm post by id
 *      parameters:
 *          -   in: path
 *              name: postId
 *              type: string
 *              required: true
 *              description: post id
 *      requestBody:
 *          required: true
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: '#/components/schemas/ConfirmPost'
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/ConfirmPost'
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
