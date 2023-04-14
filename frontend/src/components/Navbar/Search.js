import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getDataAPI, postDataAPI } from '../../utils/fetchData';
import { GLOBALTYPES } from '../../redux/actions/globalTypes'
import { Link } from 'react-router-dom'
import UserCard from '../UserCard';
import loading from '../../imgs/loading.gif'
const Search = () => {
	const [search, setSearch] = useState('');
	const [users, setUsers] = useState([]);
	const [load,setLoad] = useState(false);
	const { auth } = useSelector(state => state);
	const dispatch = useDispatch();
	const handleClose = () => {
		setSearch('');
		setUsers([]);
	}
	const handleSearch = async (e) => {
		e.preventDefault();
		if (!search) {
			return;
		}
		try {
			setLoad(true);
			const res =await getDataAPI(`search?userName=${search}`, auth.token)
			setUsers(res.data.users)
			setLoad(false);
		} catch (err) {
			dispatch({
				type: GLOBALTYPES.ALERT,
				payload: { err: err.response.data.msg }
			})
		}
	}

	return (
		<form className="search_form" onSubmit={handleSearch}>
			<input type="text" value={search} name='search' id='search' onChange={e => setSearch(e.target.value.toLowerCase().replace(/ /g, ''))} title='Enter to search'/>
			<div className="search_icon" style={{ opacity: search ? 0 : 0.7 }}>
				<span className="material-icons" >search</span>
				<span>Enter to search</span>
			</div>
			<button type='submit' style={{display:'none'}}>Search</button>

			{load && <img className='loading' src={loading} alt='loading' />}
			<div className="close_search" style={{ opacity: users.length === 0 ? 0 : 1 }} onClick={handleClose}>&times;</div>
			<div className="users">
				{
					search && users.map(user => (
						<UserCard key={user._id} user={user} border='border' handleClose={handleClose}/>
					))
				}
			</div>
		</form>
	)
}

export default Search
