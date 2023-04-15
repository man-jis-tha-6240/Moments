const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const authCtrl = {
	register: async (req, res) => {
		try {
			const { yourName, userName, email, password, gender } = req.body;
			let newUserName = userName.toLowerCase().replace(/ /g, '')
			const user_name = await User.findOne({ userName: newUserName })
			if (user_name) {
				return res.status(400).json({ msg: "This user already exists" });
			}
			const user_email = await User.findOne({ email })
			if (user_email) {
				return res.status(400).json({ msg: "This email already exists" });
			}
			if (password.length < 6) {
				return res.status(400).json({ msg: "Password must be at least 6 characters" });
			}
			const passwordHash = await bcrypt.hash(password, 12);
			const newUser = new User({
				yourName, userName: newUserName, email, password: passwordHash, gender
			});
			const access_token = createAccessToken({ id: newUser._id });
			const refresh_token = createRefreshToken({ id: newUser._id });
			res.cookie('refreshtoken', refresh_token, {
				httpOnly: true,
				sameSite: 'None',
				path: '/api/refresh_token',
				maxAge: 30 * 24 * 60 * 60 * 1000
			});
			await newUser.save();
			res.json({
				msg: 'Registered successfully',
				access_token,
				user: {
					...newUser._doc,
					password: ''
				}
			});
		} catch (error) {
			return res.status(500).json({ msg: error.message });
		}
	},
	login: async (req, res) => {
		try {
			const { email, password } = req.body

			const user = await User.findOne({ email })
				.populate("followers following", "avatar username fullname followers following")

			if (!user) return res.status(400).json({ msg: "This email does not exist." })

			const isMatch = await bcrypt.compare(password, user.password)
			if (!isMatch) return res.status(400).json({ msg: "Password is incorrect." })

			const access_token = createAccessToken({ id: user._id })
			const refresh_token = createRefreshToken({ id: user._id })

			res.cookie('refreshtoken', refresh_token, {
				httpOnly: true,
				sameSite: 'None',
				path: '/api/refresh_token',
				maxAge: 30 * 24 * 60 * 60 * 1000 // 30days
			})

			res.json({
				msg: 'Login Success!',
				access_token,
				user: {
					...user._doc,
					password: ''
				}
			})
		} catch (err) {
			return res.status(500).json({ msg: err.message })
		}
	},
	logout: async (req, res) => {
		try {
			res.clearCookie('refreshtoken', { path: '/api/refresh_token' });
			return res.json({ msg: 'Logged out!' })
		} catch (error) {
			return res.status(500).json({ msg: error.message });
		}
	},
	generateAccessToken: async (req, res) => {
		try {
			const rf_token = req.cookies.refreshtoken
			if (!rf_token) return res.status(400).json({ msg: 'Try to log in now' })
			console.log('rf-token: '+rf_token)
			jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, async (err, result) => {
				if (err) {
					return res.status(400).json({ msg: 'Try to log in now2' })
				}
				const user = await User.findById(result.id).select('-password').populate('followers following', 'avatar userName yourName followers following')
				if (!user) return res.status(400).json({ msg: 'User does not exist' });
				const access_token = createAccessToken({ id: result.id })
				res.json({
					access_token,
					user
				})
			})
		} catch (error) {
			return res.status(500).json({ msg: error.message });
		}
	}
}
const createAccessToken = (payload) => {
	return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
}
const createRefreshToken = (payload) => {
	return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '30d' });
}
module.exports = authCtrl
