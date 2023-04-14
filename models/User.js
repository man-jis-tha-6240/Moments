const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
	yourName: {
		type: String,
		required: true,
		trim: true,
		maxLength: 25
	},
	phone: {
		type: String,
		default: ''
	},
	email: {
		type: String,
		required: true,
		trim: true,
		unique: true
	},
	userName: {
		type: String,
		required: true,
		trim: true,
		maxLength: 25,
		unique: true
	},
	password: {
		type: String,
		required: true,
	},
	avatar: {
		type: String,
		default: 'https://i.pinimg.com/736x/a8/57/00/a85700f3c614f6313750b9d8196c08f5.jpg'
	},
	role: {
		type: String,
		default: 'user'
	},
	gender: {
		type: String,
		default: 'male'
	},
	story: {
		type: String,
		default: '',
		maxLength: 255,
	},
	website: {
		type: String,
		default: ''
	},
	following: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'user'
	}],
	followers: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'user'
	}],
	saved: [{
		type: mongoose.Types.ObjectId,
		ref: 'user'
	}]

}, {
	timestamps: true
})
module.exports = mongoose.model('user', UserSchema);