// Info: Create Post Response Success (response format):
/**
 * @swagger
 *  definitions:
 *      Post_Response_Success:
 *          type: object
 *          properties:
 *              _id:
 *                  type: string
 *                  example: "659c074aa9540bdb955ba89d"
 *              title:
 *                  type: string
 *                  example: "post title"
 *              description:
 *                  type: string
 *                  example: "post description"
 *              province:
 *                  province: string
 *                  example: "post province"
 *              city:
 *                  type: string
 *                  example: "post city"
 *              district:
 *                  type: string
 *                  example: "post district"
 *              isConfirmed:
 *                  type: boolean
 *                  example: "post confirm status"
 *              directCategory:
 *                  type: object
 *                  properties:
 *                      id:
 *                          type: string
 *                          example: "65a570eb81e91251621cdfd7"
 *                      title:
 *                          type: string
 *                          example: "category title"
 *                      slug:
 *                          type: string
 *                          example: "category slug"
 *              coordinate:
 *                  type: array
 *                  items:
 *                      type: number
 *                  example: [latitude number, longitude number]
 *              imagesGallery:
 *                  type: array
 *                  items:
 *                      type: object
 *                      properties:
 *                          url: string
 *                  example: "[ { url: .../.../image.jpg } ]"
 *              parameters:
 *                  type: array
 *                  items:
 *                      type: object
 *                      properties:
 *                          key:
 *                              type: string
 *                          title:
 *                              type: string
 *                          value:
 *                              type: string
 *                              example: "some value"
 */

// Info: Find Post Response Success (response format):
/**
 * @swagger
 *  definitions:
 *      Find_Post_Response_Success:
 *          type: object
 *          properties:
 *              advertisePost:
 *                      $ref: '#/definitions/Post_Response_Success'
 */

// Info: Find Array of Posts Response Success (response format):
/**
 * @swagger
 *  definitions:
 *      Find_Array_Of_Posts_Response_Success:
 *          type: object
 *          properties:
 *              advertisePosts:
 *                  type: array
 *                  items:
 *                      $ref: '#/definitions/Post_Response_Success'
 */
