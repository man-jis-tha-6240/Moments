import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { signup } from '../redux/actions/authAction';
const Signup = () => {
	const { auth, alert } = useSelector(state => state)
	const initialState = { yourName: '', userName: '', email: '', password: ''.cf_password, gender: 'male' };
	const dispatch = useDispatch();
	const navigate = useNavigate();
	useEffect(() => {
		if (auth.token) {
			navigate('/');
		}
	}, [auth.token,navigate]);
	const [userData, setUserData] = useState(initialState);
	const { yourName, userName, email, password, cf_password } = userData;
	const handleChange = (e) => {
		const { name, value } = e.target
		setUserData({ ...userData, [name]: value })
	}
	const handleSubmit = (e) => {
		e.preventDefault();
		dispatch(signup(userData));
	}
	const [visible, setVisibility] = useState(false);
	const [visible_cf, setVisibility_cf] = useState(false);
	const handleIconClick = () => {
		setVisibility(!visible);
	}
	const handleIconClick_cf = () => {
		setVisibility_cf(!visible_cf);
	}
	return (

		<div className='auth_page'>
			<form onSubmit={handleSubmit}>
				<h3 className='text-uppercase text-center mb-4'>Moments</h3>

				<div className="form-group mb-1">
					<label htmlFor="yourName">Full name</label>
					<input type="text" className="form-control" id="yourName" placeholder="Enter full name" onChange={handleChange} name='yourName' value={yourName} style={{ backgroundColor: `${alert.yourName ? '#fd2d6a14' : '#fff'}` }} />
					<small className="form-text text-danger">{alert.yourName?alert.yourName:''}</small>
				</div>
				<div className="form-group mb-1">
					<label htmlFor="userName">Username</label>
					<input type="text" className="form-control" id="userName" placeholder="Enter Username " onChange={handleChange} name='userName' value={userName.toLowerCase().replace(/ /g, '')} style={{background: `${alert.userName ? '#fd2d6a14' : ''}`}} />
					<small className="form-text text-danger">{alert.userName?alert.userName:''}</small>
				</div>
				<div className="form-group mb-1">
					<label htmlFor="exampleInputEmail1">Email address</label>
					<input type="email" className="form-control" id="exampleInputEmail1" placeholder="Enter email" onChange={handleChange} name='email' value={email} style={{ backgroundColor: `${alert.email ? '#fd2d6a14' : '#fff'}` }} />
					<small className="form-text text-danger">{alert.email?alert.email:''}</small>
				</div>
				<div className="form-group mb-1">
					<label htmlFor="exampleInputPassword1">Password</label>
					<div className="pass">
						<input type={visible ? "text" : "password"} className="form-control" id="exampleInputPassword1" placeholder="Password" onChange={handleChange} name='password' value={password} style={{ backgroundColor: `${alert.password ? '#fd2d6a14' : '#fff'}` }}/>
						<small onClick={handleIconClick}>
							{visible ? <VisibilityIcon /> : <VisibilityOffIcon />}
						</small>
					</div>
					<small className='form-text text-danger'>{alert.password?alert.password:''}</small>
				</div>
				<div className="form-group">
					<label htmlFor="cf_password">Confirm Password</label>
					<div className="pass">
						<input type={visible_cf ? "text" : "password"} className="form-control" id="cf_password" placeholder="Confirm Password" onChange={handleChange} name='cf_password' value={cf_password} style={{background: `${alert.cf_password ? '#fd2d6a14' : ''}`}}/>
						<small onClick={handleIconClick_cf}>
							{visible_cf ? <VisibilityIcon /> : <VisibilityOffIcon />}
						</small>
					</div>
					<small className='form-text text-danger'>{alert.cf_password?alert.cf_password:''}</small>
				</div>
				<br />
				<div className="d-flex justify-content-between mx-0 mb-2">
					<label htmlFor="male">
						Male <input type="radio" name="gender" id="male" value="male " defaultChecked onChange={handleChange} />
					</label>
					<label htmlFor="female">
						Female <input type="radio" name="gender" id="female" value="female" onChange={handleChange} />
					</label>
					<label htmlFor="other">
						Other <input type="radio" name="gender" id="other" value="other" onChange={handleChange} />
					</label>
				</div>
				<button type="submit" className="btn btn-danger w-100" disabled={yourName && userName && email && password && cf_password ? false : true} >Sign Up</button>
				<p>
					Already have an account? <Link to='/' style={{ color: 'crimson' }}>Login here</Link>
				</p>
			</form>
		</div >
	)
}

export default Signup
