/**
 * @swagger
 *  components:
 *      schemas:
 *          CreateParameter:
 *              type: object
 *              required:
 *                  -   title
 *                  -   key
 *                  -   type
 *                  -   category
 *              properties:
 *                  title:
 *                      type: string
 *                      description: parameter title
 *                  key:
 *                      type: string
 *                      description: parameter key
 *                  type:
 *                      type: string
 *                      description: parameter type
 *                  category:
 *                      type: string
 *                      description: parameter related category id
 *                  enum:
 *                      type: string
 *                      description: parameter enum
 *                  isRequired:
 *                      type: boolean
 *                      description: set this parameter as required or not required
 *                  guide:
 *                      type: string
 *                      description: parameter guide
 */
