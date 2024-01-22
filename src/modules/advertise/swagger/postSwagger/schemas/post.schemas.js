// Info: Create New Post
/**
 * @swagger
 *  components:
 *      schemas:
 *          CreatePost:
 *              type: object
 *              required:
 *                  -   title
 *                  -   description
 *                  -   categoryId
 *                  -   province
 *                  -   city
 *                  -   district
 *                  -   parameters
 *              properties:
 *                  title:
 *                      type: string
 *                      description: post title
 *                  description:
 *                      type: string
 *                      description: post description
 *                  categoryId:
 *                      type: string
 *                      description: post related category id
 *                  province:
 *                      type: string
 *                      description: post province
 *                  city:
 *                      type: string
 *                      description: post city
 *                  district:
 *                      type: string
 *                      description: post district
 *                  parameters:
 *                      type: array
 *                      items:
 *                          type: object
 */

// Info: Confirm One Post By Id
/**
 * @swagger
 *  components:
 *      schemas:
 *          ConfirmPost:
 *              type: object
 *              required:
 *                  -   isConfirmed
 *              properties:
 *                  isConfirmed:
 *                      type: boolean
 */
