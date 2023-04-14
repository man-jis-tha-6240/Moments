import React from 'react'
import Avatar from './Avatar'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
const UserCard = ({ children, user, border, handleClose, setShowFollowers, setShowFollowing, msg }) => {
	const { theme } = useSelector(state => state)
	const handleCloseAll = () => {
		if (handleClose) {
			handleClose();
		}
		if (setShowFollowers) {
			setShowFollowers(false);
		}
		if (setShowFollowing) {
			setShowFollowing(false);
		}
	}
	const showMSg = (user) => {
		return (
			<>
				<div style={{  color: theme ? '#bfb6b6' : '' }}>{user.text}</div>
				{
					user.media.length > 0 &&
					<div>{user.media.length} <i className='fas fa-image' /></div>
				}
				{
					user.call &&
					<span className='material-icons' style={{ filter: theme ? 'invert(1)' : 'invert(0)', color: theme ? 'rgb(80, 78, 78)' : '' }}>
						{
							user.call.times === 0
								? user.call.video ? 'videocam_off' : 'phone_disabled'
								: user.call.video ? 'video_camera_front' : 'call'
						}
					</span>
				}
			</>
		)
	}
	return (
		<div className={`d-flex p-2 align-item-center w-100 ${border} justify-content-between`}>
			<div>
				<Link to={`/profile/${user._id}`} onClick={handleCloseAll} className='d-flex align-items-center'>
					<Avatar src={user.avatar} size='big-avatar' />
					<div className="m1" style={{ transform: 'translateY(-2px)' }}>
						<span className='d-block' style={{ filter: theme ? 'invert(1)' : 'invert(0)', color: theme ? 'white' : 'rgb(80, 78, 78)',wordBreak: 'break-word' }}>
							{user.userName}
						</span>
						<small style={{ opacity: 0.7, color: theme ? 'white' : 'rgb(80, 78, 78)', filter: theme ? 'invert(1)' : 'invert(0)' }} >
							{
								msg
									? showMSg(user)
									: user.yourName
							}
						</small>
					</div>
				</Link>
			</div>
			{children}
		</div>
	)
}

export default UserCard
