const Notifies = require('../models/notify')
const notifyCtrl = {
	createNotify: async (req, res) => {
		try {
			const { id, recipients, url, text, content, img } = req.body
			if (recipients.includes(req.user._id.toString())) return;
			const notify = new Notifies({
				id, recipients, url, text, content, img, user: req.user._id
			})
			await notify.save()
			res.json({ notify })
		} catch (err) {
			return res.status(500).json({ msg: err.message });

		}
	},
	removeNotify: async (req, res) => {
		try {
			const notify = await Notifies.findOneAndDelete({
				id: req.params.id, url: req.query.url
			})
			res.json({ notify })
		} catch (err) {
			return res.status(500).json({ msg: err.message });

		}
	},
	getNotifies: async (req, res) => {
		try {
			const notifies = await Notifies.find({ recipients: req.user._id }).sort('-createdAt').populate('user', 'avatar userName')
			return res.json({ notifies })
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	},
	isReadNotify: async (req, res) => {
		try {
			const notifies = await Notifies.findOneAndUpdate({ _id: req.params.id }, { isRead: true })
			return res.json({ notifies })
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	},
	deleteAllNoti: async (req, res) => {
		try {
			const notifies = await Notifies.deleteMany({recipients: req.user._id})
			return res.json({ notifies })
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	}
}
module.exports = notifyCtrl