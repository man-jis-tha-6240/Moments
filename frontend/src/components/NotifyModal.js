import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import NoNoti from '../imgs/bell.png'
import { Link } from 'react-router-dom'
import Avatar from './Avatar'
import moment from 'moment'
import { deleteAllNotifications, isReadNotifies, NOTIFY_TYPES } from '../redux/actions/notifyAction'
const NotifyModal = () => {
	const { auth, notify, theme } = useSelector(state => state)
	const dispatch = useDispatch()
	const handleIsRead = (msg) => {
		dispatch(isReadNotifies({ msg, auth }))
	}
	const handleSound = () => {
		dispatch({ type: NOTIFY_TYPES.UPDATE_SOUND, payload: !notify.sound })
	}
	const handleDeleteAll = () => {
		const newArr = notify.data.filter(item => item.isRead === false)
		if (newArr.length === 0) {
			return dispatch(deleteAllNotifications(auth.token))
		}
		return dispatch(deleteAllNotifications(auth.token))
	}
	return (
		<div style={{ minWidth: '200px', height: '500px', overflowY: 'scroll' ,overflowX: 'hidden'}}>
			<div className="d-flex justify-content-between align-items-center px-3">

				<h5>Notifications</h5>
				{
					notify.sound
						? <i className='fas fa-bell' style={{ fontSize: '1.2rem', cursor: 'pointer' }} onClick={handleSound}></i>
						: <i className='fas fa-bell-slash' style={{ fontSize: '1.2rem', cursor: 'pointer' }} onClick={handleSound}></i>
				}
			</div>
			<hr className='mt-0' />
			{
				notify.data.length === 0 &&
				<img src={NoNoti} alt="NoNoti" style={{ filter: theme ? 'invert(1)' : 'invert(0)' }} />
			}
			<div style={{ maxHeight: 'calc(100vh-200px)' }}>
				{
					notify.data.map((msg, index) => (
						<div key={index} className="px-2 mb-3">
							<Link to={`${msg.url}`} className='d-flex text-dark align-items-center' onClick={() => handleIsRead(msg)}>
								<Avatar src={msg.user.avatar} size='big-avatar' />
								<div className="flex-fill mx-1">
									<div >
										<strong className='me-1'>{msg.user.userName}</strong>
										<span >{msg.text}</span>
									</div>
									{
										msg.content &&
										<small style={{ filter: theme ? 'invert(1)' : 'invert(0)' ,color: theme?'white':''}}>{msg.content.slice(0, 20)}...</small>
									}
								</div>
								<div style={{ width: '30px' }}>
									{msg.img && <Avatar src={msg.img} size='medium-avatar' />}
								</div>
							</Link>
							<small className='text-muted d-flex justify-content-between px-2' style={{ filter: theme ? 'invert(1)' : 'invert(0)' }}>
								{
									moment(msg.createdAt).fromNow()
								}
								{
									!msg.isRead && <i className='fas fa-circle text-primary'></i>
								}
							</small>
						</div>
					))
				}
			</div>
			<hr className='my-1' />
			<div className="text-end text-danger mr-2 fw-bold" style={{ cursor: 'pointer', padding: '5px', filter: theme ? 'invert(1)' : 'invert(0)' }} onClick={handleDeleteAll}>
				Delete All
			</div>
		</div>

	)
}

export default NotifyModal
