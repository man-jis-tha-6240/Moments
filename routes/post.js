const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const auth = require('../middleware/auth');
const postCtrl = require('../controllers/postCtrl')
router.route('/posts')
	.post(auth, postCtrl.createPost)
	.get(auth, postCtrl.getPost)
router.route('/post/:id')
	.patch(auth, postCtrl.updatePost)
	.get(auth, postCtrl.getSinglePost)
	.delete(auth, postCtrl.deletePost)
router.patch('/post/:id/like', auth, postCtrl.likePost)
router.patch('/post/:id/unlike', auth, postCtrl.unLikePost)
router.get('/user_posts/:id', auth, postCtrl.getUserPost)
router.get('/post_discover', auth, postCtrl.getPostDiscover)
router.patch('/savePost/:id',auth, postCtrl.savePost)
router.patch('/unSavePost/:id',auth, postCtrl.unSavePost)
router.get('/getSavedPosts',auth, postCtrl.getSavePosts)
module.exports = router;