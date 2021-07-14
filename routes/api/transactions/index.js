const express = require('express')
const router = express.Router()
const controllers = require('../../../controllers/transactions')
const guard = require('../../../helpers/guard')
const {
  validationCreateTransaction,
  validationUpdateTransaction,
  validateMongoId,
} = require('./validation')

/**
 * @swagger
 * components:
 *   schemas:
 *     Transaction:
 *       type: object
 *       required:
 *         - date
 *         - income
 *         - category
 *         - comment
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the transaction
 *         date:
 *           type: string
 *           description: The date of create transaction
 *         category:
 *           type: string
 *           description: The category of transaction
 *         income:
 *           type: Boolean
 *           description: Income or Outcome of transaction
 *         comment:
 *           type: string
 *           description: The details of transaction`s category
 *         sum:
 *           type: number
 *           description: Sum of income or outcome
 *       example:
 *         date: 2021-04-27T12:15:23.174Z
 *         income: true
 *         category: Regular
 *         comment: Present for wife
 *         sum: 12000
 */

/**
 * @swagger
 * components:
 *     securitySchemes:
 *       bearerAuth:
 *         type: http
 *         scheme: bearer
 *         bearerFormat: JWT
 */

/**
 * @swagger
 * /transactions:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     summary: Returns the list of all the transactions
 *     tags: [Transaction]
 *     responses:
 *       200:
 *         description: The list of the transactions
 *       401:
 *         description: Unauthorized
 */

router.get('/', guard, controllers.getAll)

/**
 * @swagger
 * /transactions:
 *   post:
 *     security:
 *      - bearerAuth: []
 *     summary: Add a new transaction
 *     tags: [Transaction]
 *     requestBody:
 *       required: true
 *       content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Transaction'
 *     responses:
 *       200:
 *         description: The transaction was successfully created
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Some server error
 */

router.post('/', guard, validationCreateTransaction, controllers.addTransaction)

/**
 * @swagger
 * /transactions/{transactionId}:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     summary: Get the transaction by id
 *     tags: [Transaction]
 *     parameters:
 *       - in: path
 *         name: transactionId
 *         schema:
 *           type: string
 *         required: true
 *         description: The transaction id
 *     responses:
 *       200:
 *         description: The transaction description by id
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: The transaction was not found
 */

router.get('/:transactionId', guard, controllers.getTransactionById)

/**
 * @swagger
 * /transactions/{transactionId}:
 *   delete:
 *     security:
 *      - bearerAuth: []
 *     summary: Delete the transaction by id
 *     tags: [Transaction]
 *     parameters:
 *       - in: path
 *         name: transactionId
 *         schema:
 *           type: string
 *         required: true
 *         description: The transaction id
 *     responses:
 *       200:
 *         description: Transaction deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: The transaction was not found
 */

router.delete('/:transactionId', guard, controllers.removeTransaction)

/**
 * @swagger
 * /transactions/{transactionId}:
 *  put:
 *     security:
 *      - bearerAuth: []
 *    summary: Update the transaction by the id
 *    tags: [Transaction]
 *     parameters:
 *       - in: path
 *         _id: transactionId
 *         owner: userId
 *        schema:
 *          type: string
 *        required: true
 *        description: The transaction id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Transaction'
 *    responses:
 *      200:
 *        description: The transaction was updated
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: The transaction was not found
 *      500:
 *        description: Some error happened
 */

router.patch(
  '/:transactionId',
  guard,
  validationUpdateTransaction,
  validateMongoId,
  controllers.updateTransaction
)

module.exports = router
