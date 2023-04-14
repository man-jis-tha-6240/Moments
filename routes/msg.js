const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const msgCtrl = require('../controllers/msgCtrl')
router.post('/message', auth, msgCtrl.createMsg)
router.get('/conversations', auth, msgCtrl.getConversations)
router.get('/message/:id', auth, msgCtrl.getMessage)
router.delete('/message/:id', auth, msgCtrl.deleteMsg)
router.delete('/conversation/:id', auth, msgCtrl.deleteConvo)
module.exports = router