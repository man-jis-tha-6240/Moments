import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../../redux/actions/authAction'
import { GLOBALTYPES } from '../../redux/actions/globalTypes'
import Avatar from '../Avatar'
import NotifyModal from '../NotifyModal'
<link href="https://fonts.googleapis.com/icon?family=Material+Icons"
	rel="stylesheet"></link>
const Menu = () => {
	const navLinks = [
		{ label: 'Home', icon: 'home', path: '/' },
		{ label: 'Message', icon: 'near_me', path: '/message' },
		{ label: 'Discover', icon: 'explore', path: '/discover' },
	]
	const dispatch = useDispatch();
	const { auth, theme, notify } = useSelector(state => state);
	const { pathname } = useLocation();
	const isActive = (pn) => {
		if (pn === pathname) return 'active';
	}
	return (
		<div className="menu" >
			<ul className="navbar-nav flex-row">
				{
					navLinks.map((link, index) => (
						<li className={`nav-item px-2 ${isActive(link.path)}`} key={index}>
							<Link className='nav-link' to={link.path}>
								<span className="material-icons">{link.icon}</span>
							</Link>
						</li>
					))
				}
				<li className="nav-item dropdown" style={{ opacity: 1 }}>
					<a className="nav-link position-relative" id="navbarDarkDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
						<span className="material-icons" style={{ color: notify.data.length > 0 ? 'crimson' : '', filter: theme ? 'invert(1)' : 'invert(0)' }}>favorite</span>
						<span className='notify-length' style={{ filter: theme ? 'invert(1)' : 'invert(0)' }}>{notify.data.length}</span>
					</a>
					<ul className="dropdown-menu dropdown-menu-light" aria-labelledby="navbarDarkDropdownMenuLink" style={{ transform: 'translateX(50px)' }}>
						<NotifyModal />
					</ul>
				</li>
				<li className="nav-item dropdown" style={{ opacity: 1 }}>

					<span className="nav-link dropdown-toggle" to="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-haspopup='true' aria-expanded="false">
						<Avatar src={auth.user.avatar} size='medium-avatar' />
					</span>

					<ul className="dropdown-menu" aria-labelledby="navbarDropdown">
						<li><Link className="dropdown-item" to={`/profile/${auth.user._id}`}>Profile</Link></li>

						<label htmlFor="theme" className='dropdown-item' onClick={() => dispatch({ type: GLOBALTYPES.THEME, payload: !theme })}>{theme ? 'Light mode' : 'Dark mode'}</label>

						<li><Link className="dropdown-item" to="/"></Link></li>

						<li><hr className="dropdown-divider" /></li>

						<li><Link className="dropdown-item" to="/" onClick={() => dispatch(logout())}>Logout</Link></li>
					</ul>
				</li>
			</ul>
		</div>
	)
}

export default Menu