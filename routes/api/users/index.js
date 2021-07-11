const express = require('express')
const router = express.Router()
const ctrlUser = require('../../../controllers/users')
const guard = require('../../../helpers/guard')
const upload = require('../../../helpers/upload')
const { validateSignInUser, validationSignUpUser } = require('./validation')

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - password
 *         - email
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the transaction
 *         password:
 *           type: string
 *           description: The password of user`s account
 *         email:
 *           type: string
 *           description: The email address
 *         token:
 *           type: string
 *           description: The token for authorization
 *         isVerified:
 *           type: boolean
 *           description: Verification value of user`s email
 *         verifyToken:
 *           type: string
 *           description: The verified token
 *       example:
 *         password: 12345678
 *         email: shelby@gmail.com
 *         name: Thomas
 */

/**
 * @swagger
 * /users/signup:
 *   post:
 *     summary: SignUp new user in to app
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: You registered successfully
 *       409:
 *         description: Email is already used
 *       500:
 *         description: System error
 */
router.post('/signup', validationSignUpUser, ctrlUser.signUpUser)

/**
 * @swagger
 * /users/signin:
 *   post:
 *     summary: Sign in to app
 *     tags: [User]
 *     requestBody:
 *       content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/User'
 *          example:
 *            password: "12345678"
 *            email: shelby1234@ukr.net
 *     responses:
 *       200:
 *         description: You sign in successfully
 *       401:
 *         description: Invalid login or password
 */

router.post('/signin', validateSignInUser, ctrlUser.signIn)

/**
 * @swagger
 * /users/signout:
 *   post:
 *     security:
 *      - bearerAuth: []
 *     summary: Sign out from app
 *     tags: [User]
 *     responses:
 *       204:
 *         description: Successful logout
 *       401:
 *         description: Token is lost in header
 *       500:
 *         description: System error
 */
router.post('/signout', guard, ctrlUser.signOut)

/**
 * @swagger
 * /users/current:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     summary: Get current user
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Find your information
 *       401:
 *         description: Lost token in header
 *       500:
 *         description: System error
 */
router.get('/current', guard, ctrlUser.currentUser)
router.get('/verify/:token', ctrlUser.verifyUser)
router.post('/verify', ctrlUser.repeatVerification)
router.patch('/avatars', guard, upload.single('avatar'), ctrlUser.avatars)

module.exports = router
