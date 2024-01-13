// Info: Create Parameter Response Success (response format):
/**
 * @swagger
 *  definitions:
 *      Parameter_Response_Success:
 *          type: object
 *          properties:
 *              _id:
 *                  type: string
 *                  example: "659c074aa9540bdb955ba89d"
 *              title:
 *                  type: string
 *                  example: "parameter title"
 *              key:
 *                  type: string
 *                  example: "parameter key"
 *              type:
 *                  type: string
 *                  example: "parameter type"
 *              guide:
 *                  type: string
 *                  example: "parameter type"
 *              category:
 *                  type: string
 *                  example: "parameter related category id"
 *              enum:
 *                  type: array
 *                  items:
 *                      type: string
 *                  example: [enum-1, enum-2, enum-3]
 */

// Info: Find Parameter Response Success (response format):
/**
 * @swagger
 *  definitions:
 *      Find_Parameter_Response_Success:
 *          type: object
 *          properties:
 *              _id:
 *                  type: string
 *                  example: "659c074aa9540bdb955ba89d"
 *              title:
 *                  type: string
 *                  example: "parameter title"
 *              key:
 *                  type: string
 *                  example: "parameter key"
 *              type:
 *                  type: string
 *                  example: "parameter type"
 *              guide:
 *                  type: string
 *                  example: "parameter type"
 *              enum:
 *                  type: array
 *                  items:
 *                      type: string
 *                  example: [enum-1, enum-2, enum-3]
 *              category:
 *                  type: object
 *                  properties:
 *                      _id:
 *                          type: string
 *                      title:
 *                          type: string
 *                      slug:
 *                          type: string
 *                      children:
 *                          type: array
 *                          items:
 *                              type: object
 *                              properties:
 *                                  _id:
 *                                      type: string
 *                                  title:
 *                                      type: string
 *                                  slug:
 *                                      type: string
 *                                  children:
 *                                      type: array
 *                                      items:
 *                                          type: object
 */

// Info: Find Parameter By Category Slug Response Success (response format):
/**
 * @swagger
 *  definitions:
 *      Find_Parameter_By_Slug_Response_Success:
 *          type: object
 *          properties:
 *              _id:
 *                  type: string
 *                  example: "659c074aa9540bdb955ba89d"
 *              title:
 *                  type: string
 *                  example: "parameter title"
 *              key:
 *                  type: string
 *                  example: "parameter key"
 *              type:
 *                  type: string
 *                  example: "parameter type"
 *              guide:
 *                  type: string
 *                  example: "parameter guide"
 *              enum:
 *                  type: array
 *                  items:
 *                      type: string
 *                  example: [enum-1, enum-2, enum-3]
 *              categoryTitle:
 *                  type: string
 *                  example: "parameter related category title"
 *              categorySlug:
 *                  type: string
 *                  example: "parameter related category slug"
 *              categoryIcon:
 *                  type: string
 *                  example: "parameter related category icon"
 */

// Info: List Of Parameters (response format):
/**
 * @swagger
 *  definitions:
 *      ListOfParameters:
 *          type: object
 *          properties:
 *              parameters:
 *                  type: array
 *                  items:
 *                      $ref: '#/definitions/Find_Parameter_Response_Success'
 */
