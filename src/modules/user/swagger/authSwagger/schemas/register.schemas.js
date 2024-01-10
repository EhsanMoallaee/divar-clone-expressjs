// Info: Registeration Request
/**
 * @swagger
 *  components:
 *      schemas:
 *          RegisterationRequest:
 *              type: object
 *              required:
 *                  -   firstname
 *                  -   lastname
 *                  -   mobile
 *              properties:
 *                  firstname:
 *                      type: string
 *                      description: firstname
 *                  lastname:
 *                      type: string
 *                      description: lastname
 *                  mobile:
 *                      type: string
 *                      description: mobile number 09...
 */

// Info: Register
/**
 * @swagger
 *  components:
 *      schemas:
 *          Register:
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
