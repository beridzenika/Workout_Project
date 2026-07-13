const express = require('express');
const router = express.Router();

const authenticate = require("../../middleware/auth/authenticate");
const authController = require("../../controllers/auth/authController");

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh', authController.refresh);
// router.post('/logout', authController.logout);

router.get('/me', authenticate, authController.me);

module.exports = router;