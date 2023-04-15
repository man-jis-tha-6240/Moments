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
	}
}
const createAccessToken = (payload) => {
	return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
}

module.exports = authCtrl
