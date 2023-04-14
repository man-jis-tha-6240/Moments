const Conversations = require('../models/Convo')
const Messages = require('../models/Message')
class APIfeatures {
	constructor(query, queryString) {
		this.query = query;
		this.queryString = queryString;
	}
	paginating() {
		const page = this.queryString.page * 1 || 1
		const limit = this.queryString.limit * 1 || 9
		const skip = (page - 1) * limit
		this.query = this.query.skip(skip).limit(limit)
		return this;
	}
}
const msgCtrl = {
	createMsg: async (req, res) => {
		try {
			const { sender, recipient, text, media, call } = req.body
			if (!recipient || (!text.trim() && media.length === 0 && !call)) {
				return
			}
			const newConversation = await Conversations.findOneAndUpdate({
				$or: [
					{ recipients: [sender, recipient] },
					{ recipients: [recipient, sender] }
				]
			}, {
				recipients: [sender, recipient],
				text, media, call
			}, { new: true, upsert: true })
			const newMessage = new Messages({
				conversation: newConversation._id,
				sender, call,
				recipient, text, media
			})
			await newMessage.save()
			res.json('Msg created')
		} catch (err) {
			return res.status(500).json({ msg: err.message })
		}
	},
	getConversations: async (req, res) => {
		try {
			const features = new APIfeatures(Conversations.find({
				recipients: req.user._id
			}), req.query).paginating()
			const conversations = await features.query.sort('-updatedAt').populate('recipients', 'avatar userName yourName')
			res.json({
				conversations,
				result: conversations.length
			})
		} catch (err) {
			return res.status(500).json({ msg: err.message })
		}
	},
	getMessage: async (req, res) => {
		try {
			const features = new APIfeatures(Messages.find({
				$or: [
					{
						sender: req.user._id, recipient: req.params.id
					},
					{
						sender: req.params.id, recipient: req.user._id
					},
				]
			}), req.query).paginating()
			const messages = await features.query.sort('-createdAt')
			res.json({
				messages,
				result: messages.length
			})
		} catch (err) {
			return res.status(500).json({ msg: err.message })
		}
	},
	deleteMsg: async (req, res) => {
		try {
			await Messages.findOneAndDelete({ _id: req.params.id, sender: req.user._id })
			res.json({ msg: 'Msg Deleted' })
		} catch (err) {
			return res.status(500).json({ msg: err.message })
		}
	},
	deleteConvo: async (req, res) => {
		try {
			const newConvo = await Conversations.findOneAndDelete({
				$or: [
					{ recipients: [req.user._id, req.params.id] },
					{ recipients: [req.params.id, req.user._id] }
				]
			})
			await Messages.deleteMany({ conversation: newConvo._id })
			res.json({ msg: 'Conversation deleted successfully' })
		} catch (err) {
			return res.status(500).json({ msg: err.message })
		}
	}
}
module.exports = msgCtrl