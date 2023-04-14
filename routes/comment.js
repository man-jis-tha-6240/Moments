const router=require('express').Router()
const cmntCtrl=require('../controllers/comntCtrl')
const auth=require('../middleware/auth')
router.post('/comment',auth,cmntCtrl.createCmnt)
router.patch('/comment/:id',auth,cmntCtrl.updateCmnt)
router.patch('/comment/:id/like',auth,cmntCtrl.likeCmnt)
router.patch('/comment/:id/unlike',auth,cmntCtrl.unLikeCmnt)
router.delete('/comment/:id',auth,cmntCtrl.deleteCmnt)
module.exports=router