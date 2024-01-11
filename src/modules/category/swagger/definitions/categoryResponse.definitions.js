// Info: Create Category Response Success (response format):
/**
 * @swagger
 *  definitions:
 *      Category_Response_Success:
 *          type: object
 *          properties:
 *              _id:
 *                  type: string
 *                  example: "659c074aa9540bdb955ba89d"
 *              title:
 *                  type: string
 *                  example: "Category title"
 *              slug:
 *                  type: string
 *                  example: "Category slug"
 *              description:
 *                  type: string
 *                  example: "Category desc"
 *              icon:
 *                  type: string
 *                  example: "Category icon"
 *              parentId:
 *                  type: string
 *                  example: "Category parentId"
 *              parentsIdArray:
 *                  type: array
 *                  items:
 *                      type: string
 *                  example: ["parentId-1", "parentId-2", "parentId-3"]
 *              children:
 *                  type: array
 *                  items:
 *                      type: string
 *                  example: ["category-1", "category-2", "category-3"]
 */

// Info: List Of Categories (response format):
/**
 * @swagger
 *  definitions:
 *      ListOfCategories:
 *          type: object
 *          properties:
 *              categories:
 *                  type: array
 *                  items:
 *                      $ref: '#/definitions/Category_Response_Success'
 */
