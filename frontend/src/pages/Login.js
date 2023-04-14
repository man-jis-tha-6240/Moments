import React, { useState,useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../redux/actions/authAction'
import { useDispatch,useSelector } from 'react-redux';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
const Login = () => {
	const initialState = { email: '', password: '' };
	const [userData, setUserData] = useState(initialState);
	const { email, password } = userData;
	const { auth } = useSelector(state => state)
	const dispatch = useDispatch();
	const navigate=useNavigate();
	const handleChange = (e) => {
		const { name, value } = e.target
		setUserData({ ...userData, [name]: value })
	}
	const handleSubmit = (e) => {
		e.preventDefault();
		dispatch(login(userData));
	}
	const [visible, setVisibility] = useState(false);
	const handleIconClick=()=>{
		setVisibility(!visible);
	}
	useEffect(() => {
		if (auth.token) {
			navigate('/');		
		}
	}, [auth.token,navigate]);
	return (
		<div className='auth_page'>
			<form onSubmit={handleSubmit}>
				<h3 className='text-uppercase text-center mb-4'>Moments</h3>
				<div className="form-group">
					<label htmlFor="exampleInputEmail1">Email address</label>
					<input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" onChange={handleChange} name='email' value={email} />
					<small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
				</div>
				<div className="form-group">
					<label htmlFor="exampleInputPassword1">Password</label>
					<div className="pass">
						<input type={visible ? "text" : "password"} className="form-control" id="exampleInputPassword1" placeholder="Password" onChange={handleChange} name='password' value={password} />
						<small onClick={handleIconClick}>
							{visible ? <VisibilityIcon/>:<VisibilityOffIcon/>}
						</small>
					</div>
				</div>
				<br />
				<button type="submit" className="btn btn-danger w-100" disabled={email && password ? false : true} >Login</button>
				<p>
					Don't have an account? <Link to='/signup' style={{ color: 'crimson' }}>Register here</Link>
				</p>
			</form>
		</div >
	)
}

export default Login
