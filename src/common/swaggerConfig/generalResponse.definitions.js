// Info: Success Response Without Data
/**
 * @swagger
 *  definitions:
 *      Success_Response_With_Message:
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
 *      Success_Response_Without_Message:
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
 *      Failed_Response_Client_Error:
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
 *      Failed_Response_Server_Error:
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
 *      Not_Found_Response:
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

// Info: Failed Response UnAuthorized
/**
 * @swagger
 *  definitions:
 *      UnAuthorized_Response:
 *          type: object
 *          properties:
 *              statusCode:
 *                  type: integer
 *                  example: 401
 *              success:
 *                  type: boolean
 *                  example: false
 *              message:
 *                  type: string
 *                  example: "لطفا ابتدا وارد حساب کاربری خود شوید"
 */
