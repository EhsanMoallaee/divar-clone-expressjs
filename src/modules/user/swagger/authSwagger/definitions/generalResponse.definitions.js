// Info: Success Response Without Data
/**
 * @swagger
 *  definitions:
 *      Success-Response-With-Message:
 *          type: object
 *          properties:
 *              message:
 *                  type: string
 *                  example: "Success message related to route action"
 */

// Info: Success Response Without Message
/**
 * @swagger
 *  definitions:
 *      Success-Response-Without-Message:
 *          type: object
 *          properties:
 *              statusCode:
 *                  type: integer
 *                  example: 20X
 *              success:
 *                  type: boolean
 *                  example: true
 */

// Info: Failed Response Client Error
/**
 * @swagger
 *  definitions:
 *      Failed-Response-Client-Error:
 *          type: object
 *          properties:
 *              statusCode:
 *                  type: integer
 *                  example: 400
 *              success:
 *                  type: boolean
 *                  example: false
 *              message:
 *                  type: string
 *                  example: "Failed message related to the route action"
 */

// Info: Failed Response Server Error
/**
 * @swagger
 *  definitions:
 *      Failed-Response-Server-Error:
 *          type: object
 *          properties:
 *              statusCode:
 *                  type: integer
 *                  example: 500
 *              success:
 *                  type: boolean
 *                  example: false
 *              message:
 *                  type: string
 *                  example: "Internal server error occured"
 */

// Info: Failed Response Not Found Data
/**
 * @swagger
 *  definitions:
 *      Not-Found-Response:
 *          type: object
 *          properties:
 *              statusCode:
 *                  type: integer
 *                  example: 404
 *              success:
 *                  type: boolean
 *                  example: false
 *              message:
 *                  type: string
 *                  example: "Item not found"
 */
