const express = require('express');
const authCtrl = require('../controllers/authCtrl');
const router = express.Router();
router.post('/register', authCtrl.register);
router.post('/login', authCtrl.login);
router.post('/logout', authCtrl.logout);
router.post('/refresh_token', authCtrl.generateAccessToken);
module.exports = router;