const mongoose = require('mongoose')
const convoSchema = new mongoose.Schema({
	recipients: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
	text: String,
	media: Array,
	call: Object
}, {
	timestamps: true
})
module.exports = mongoose.model('conversation', convoSchema)