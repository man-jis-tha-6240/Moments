import React from 'react'
import Menu from './Menu';
import Search from './Search';
const Navbar = () => {

	return (
		<div className="header bg-light">
			<nav className="navbar navbar-expand-lg navbar-light bg-light justify-content-between align-middle">
				<h1 className="navbar-brand text-uppercase p-0 m-0 logo" style={{ cursor: 'pointer' }} onClick={() => window.scrollTo({top: 0})}>Moments</h1>

				<Search/>
				<Menu/>
			</nav>
		</div>
	)
}

export default Navbar
