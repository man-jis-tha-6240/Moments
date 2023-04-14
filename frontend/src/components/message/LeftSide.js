import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import UserCard from '../UserCard'
import { getDataAPI } from '../../utils/fetchData'
import { GLOBALTYPES } from '../../redux/actions/globalTypes'
import { getConversations, MESS_TYPES } from '../../redux/actions/msgAction'
const LeftSide = () => {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const pageEnd = useRef()
	const { auth, message, online,theme } = useSelector(state => state)
	const [search, setSearch] = useState('')
	const [searchUsers, setSearchUsers] = useState([])
	const [page, setPage] = useState(0)
	const { id } = useParams()
	const handleSearch = async (e) => {
		e.preventDefault();
		if (!search) {
			return setSearchUsers([]);
		}
		try {
			const res = await getDataAPI(`search?userName=${search}`, auth.token)
			setSearchUsers(res.data.users)
		} catch (err) {
			dispatch({
				type: GLOBALTYPES.ALERT,
				payload: { err: err.response.data.msg }
			})
		}
	}
	const handleAddChat = (user) => {
		setSearch('')
		setSearchUsers([])
		dispatch({ type: MESS_TYPES.ADD_USER, payload: { ...user, text: '', media: [] } })
		dispatch({ type: MESS_TYPES.CHECK_ONLINE_OFFLINE, payload: online })
		return navigate(`/message/${user._id}`)
	}
	const isActive = (user) => {
		if (id === user._id) {
			return 'active'
		}
		else {
			return ''
		}
	}
	useEffect(() => {
		if (message.firstLoad) {
			return
		}
		dispatch(getConversations({ auth }))
	}, [dispatch, auth, message.firstLoad])
	useEffect(() => {
		const observer = new IntersectionObserver(entries => {
			if (entries[0].isIntersecting) {
				setPage(p => p + 1)
			}
		}, {
			threshold: 0.1
		})
		observer.observe(pageEnd.current)
	}, [setPage])
	useEffect(() => {
		if (message.resultUsers >= (page - 1) * 9 && page > 1) {
			dispatch(getConversations({ auth, page }))
		}
	}, [message.resultUsers, page, auth, dispatch])
	useEffect(() => {
		if (message.firstLoad) {
			dispatch({ type: MESS_TYPES.CHECK_ONLINE_OFFLINE, payload: online })
		}
	}, [online, message.firstLoad, dispatch])
	return (
		<>
			<form className="msg_header" onSubmit={handleSearch}>
				<input type="text" value={search} placeholder='Enter to Search' onChange={e => setSearch(e.target.value)} />
				<button type="submit" style={{ display: 'none' }}>Search</button>
			</form>
			<div className="msg-chat-list">
				{
					searchUsers.length !== 0 ?
						<>
							{searchUsers.map(user => (
								<div key={user._id} className={`msg-user ${isActive(user)}`} onClick={() => handleAddChat(user)}>
									<UserCard user={user} />
								</div>
							))}
						</>
						:
						<>
							{
								message.users.map(user => (
									<div key={user._id} className={`msg-user ${isActive(user)}`} onClick={() => handleAddChat(user)}>
										<UserCard user={user} msg={true}>
											{user.online
												? <i className='fas fa-circle text-success' style={{ filter: theme ? 'invert(1)' : 'invert(0)' }}/>
												: auth.user.following.find(item => item._id === user._id) &&
												<i className='fas fa-circle' style={{ filter: theme ? 'invert(1)' : 'invert(0)' }}/>}
										</UserCard>
									</div>
								))
							}
						</>
				}
				<button ref={pageEnd} style={{ opacity: 0 }}>Load more</button>
			</div>
		</>
	)
}

export default LeftSide
