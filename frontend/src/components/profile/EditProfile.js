import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { checkImage } from '../../utils/ImageUpload'
import { GLOBALTYPES } from '../../redux/actions/globalTypes'
import { updateProfileUSers } from '../../redux/actions/profileAction'
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@48,400,0,0" />

const EditProfile = ({ setOnEdit }) => {
	const dispatch = useDispatch();
	const { auth, theme } = useSelector(state => state)
	const initialState = {
		yourName: '', phone: '', website: '', story: '', gender: ''
	}
	const [userData, setUserData] = useState(initialState)
	const { yourName, phone, website, story, gender } = userData
	const [avatar, setAvatar] = useState('')
	useEffect(() => {
		setUserData(auth.user);
	}, [auth.user])
	const changeAvatar = (e) => {
		const file = e.target.files[0]
		const err = checkImage(file);
		if (err) {
			return dispatch({ type: GLOBALTYPES.ALERT, payload: { err: err } })
		}
		setAvatar(file)
	}
	const handleChange = (e) => {
		const { name, value } = e.target
		setUserData({ ...userData, [name]: value })
	}
	const handleSubmit = (e) => {
		e.preventDefault();
		dispatch(updateProfileUSers({ userData, avatar, auth }))
		setOnEdit(false)
	}
	return (
		<div className='edit_profile'>
			<button className='btn btn-close' onClick={() => setOnEdit(false)}>&times;
			</button>
			<form onSubmit={handleSubmit}>
				<div className="info_avatar">
					<div className='d-flex'>

						<img src={avatar ? URL.createObjectURL(avatar) : auth.user.avatar} alt="profile pic" className='supper-avatar' style={{ filter: theme ? 'invert(1)' : 'invert(0)' }} />
					</div>
					<span className='avatar-spans'>
						<i className="material-icons">photo_camera</i>
						<p>Change</p>
						<input type="file" name="file" id="file_up" accept='immage/*' onChange={changeAvatar} />
					</span>
				</div>
				<div className="form_group">
					<label htmlFor="yourName">Full name</label>
					<div className='position-relative'>
						<input type="text" className='form-control' id='yourName' name='yourName' value={yourName} onChange={handleChange} />
						<small className='text-danger position-absolute' style={{ top: '50%', right: '5px', transform: 'translateY(-50%)', filter: theme ? 'invert(1)' : 'invert(0)' }}>{yourName.length}/25</small>
					</div>
				</div>
				<div className="form-group">
					<label htmlFor="phone">Phone</label>
					<input type="text" name='phone' value={phone} className='form-control' onChange={handleChange} />
				</div>
				<div className="form-group">
					<label htmlFor="website">Website</label>
					<input type="text" name='website' value={website} className='form-control' onChange={handleChange} />
				</div>
				<div className="form-group">
					<label htmlFor="story">Story</label>
					<textarea rows={4} cols={30} type="text" name='story' value={story} className='form-control' onChange={handleChange} />
					<small className='text-danger d-block text-right' style={{ filter: theme ? 'invert(1)' : 'invert(0)' }}>{story.length}/200</small>
				</div>
				<label htmlFor="gender">Gender</label>
				<div className="input-group px-0 mb-4">
					<select name="gender" id="gender" className='custom-select text-capitalize' onChange={handleChange} value={gender}>
						<option value="male">Male</option>
						<option value="female">Female</option>
						<option value="other">Other</option>
					</select>
				</div>
				<button className='btn btn-danger w-100' type='submit' style={{ filter: theme ? 'invert(1)' : 'invert(0)' }}>Save</button>
			</form>
		</div>
	)
}

export default EditProfile
