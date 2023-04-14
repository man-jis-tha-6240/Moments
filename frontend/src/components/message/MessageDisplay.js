import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { deleteMsg } from '../../redux/actions/msgAction'
import { imgShow, videoShow } from '../../utils/mediaShow'
import Avatar from '../Avatar'
import Times from './Times'
const MessageDisplay = ({ user, msg, theme, data }) => {
	const { auth } = useSelector(state => state)
	const dispatch = useDispatch()
	const handleDeleteMsg = () => {
		if (data) {
			dispatch(deleteMsg({ msg, data, auth }))
		}
	}
	return (
		<>
			<div className="chat-title">
				<Avatar src={user.avatar} size='low-avatar' />
				<span>{user.userName}</span>
			</div>
			<div className="you-content">
				{
					user._id === auth.user._id &&
					<i className='fas fa-trash' style={{ color: 'rgb(228, 162, 175)', cursor: 'pointer', filter: theme ? 'invert(1)' : 'invert(0)' }} onClick={handleDeleteMsg} />
				}
				<div>
					{
						msg.text &&
						<div className="chat-text" style={{ filter: theme ? 'invert(1)' : 'invert(0)' }}>{msg.text}</div>
					}
					{
						msg.media.map((item, index) => (
							<div key={index}>
								{
									item.url.match(/video/i)
										? videoShow(item.url, theme)
										: imgShow(item.url, theme)
								}
							</div>
						))
					}
				</div>
				{
					msg.call &&
					<button className='btn d-flex align-items-center py-3' style={{ background: '#eee', borderRadius: '10px' }}>
						<span className='material-icons font-weight-bold mr-1' style={{ fontSize: '2.5rem', color: msg.call.times === 0 ? 'crimson' : 'green', filter: theme ? 'invert(1)' : 'invert(0)' }}>
							{
								msg.call.times === 0
									? msg.call.video ? 'videocam_off' : 'phone_disabled'
									: msg.call.video ? 'video_camera_front' : 'call'
							}
						</span>
						<div className="text-left">
							<h6>{msg.call.video ? 'Video Call' : 'Audio Call'}</h6>
							<small>
								{
									msg.call.times > 0
										? <Times total={msg.call.times} />
										: new Date(msg.createdAt).toLocaleTimeString()
								}
							</small>
						</div>
					</button>
				}
			</div>
			<div className="chat-time">
				{new Date(msg.createdAt).toLocaleString()}
			</div>
		</>
	)
}

export default MessageDisplay