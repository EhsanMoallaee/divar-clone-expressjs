/**
 * @swagger
 *  components:
 *      schemas:
 *          LoginRequest:
 *              type: object
 *              required:
 *                  -   mobile
 *              properties:
 *                  mobile:
 *                      type: string
 *                      description: mobile number 09...
 */

/**
 * @swagger
 *  components:
 *      schemas:
 *          Login:
 *              type: object
 *              required:
 *                  -   mobile
 *                  -   otpCode
 *              properties:
 *                  mobile:
 *                      type: string
 *                      description: mobile number 09...
 *                  otpCode:
 *                      type: string
 *                      description: received otpCode
 */
