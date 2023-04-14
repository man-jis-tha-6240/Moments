const Comments = require('../models/Comments')
const Post = require('../models/Post')
const cmntCtrl = {
	createCmnt: async (req, res) => {
		try {
			const { postId, content, tag, reply, postUserId } = req.body;
			const post = await Post.findById(postId);
			if (!post) {
				return res.status(400).json({ msg: 'No such post' })
			}
			if (reply) {
				const cm = await Comments.findById(reply);
				if (!cm) {
					return res.status(400).json({ msg: 'No such comment' })
				}
			}
			const newCmnt = new Comments({
				user: req.user._id, content, tag, reply, postUserId, postId
			})
			await Post.findOneAndUpdate({ _id: postId }, {
				$push: { comments: newCmnt._id }
			}, { new: true })
			await newCmnt.save()
			res.json({ newCmnt })
		} catch (err) {
			return res.status(500).json({ msg: err.message })
		}
	},
	updateCmnt: async (req, res) => {
		try {
			const { content } = req.body;
			await Comments.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, {
				content
			})

			res.json({ msg: 'comment updated' })
		} catch (err) {
			return res.status(500).json({ msg: err.message })
		}
	},
	likeCmnt: async (req, res) => {
		try {
			const comment = await Comments.find({ _id: req.params.id, likes: req.user._id })
			if (comment.length > 0) {
				return res.status(400).json({ msg: 'You liked this comment' });
			}
			await Comments.findOneAndUpdate({ _id: req.params.id }, {
				$push: { likes: req.user._id }
			}, { new: true })
			res.json({ msg: 'Comment liked' })
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	},
	unLikeCmnt: async (req, res) => {
		try {
			await Comments.findOneAndUpdate({ _id: req.params.id }, {
				$pull: { likes: req.user._id }
			}, { new: true })
			res.json({ msg: 'Comment liked' })
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	},
	deleteCmnt: async (req, res) => {
		try {
			const comment = await Comments.findOneAndDelete({
				_id: req.params.id,
				$or: [
					{ user: req.user._id },
					{ postUserId: req.user._id }
				]
			})
			await Post.findOneAndUpdate({ _id: comment.postId }, {
				$pull: { comments: req.params.id }
			})
			res.json({ msg: 'Comment deleted' })
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	}
}
module.exports = cmntCtrl