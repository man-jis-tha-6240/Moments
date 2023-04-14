import React from 'react';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Avatar from '../Avatar'
import EditProfile from './EditProfile';
import FollowBtn from '../FollowBtn';
import Followers from './Followers';
import Following from './Following';
import { GLOBALTYPES } from '../../redux/actions/globalTypes';
const Info = ({auth, profile, dispatch, id}) => {
	const { theme } = useSelector(state => state)
	const [userData, setUserData] = useState([]);
	const [onEdit, setOnEdit] = useState(false);
	const [showFollowers, setShowFollowers] = useState(false);
	const [showFollowing, setShowFollowing] = useState(false);
	useEffect(() => {
		if (id === auth.user._id) {
			setUserData([auth.user])
		}
		else {
			const newData = profile.users.filter(user => user._id === id)
			setUserData(newData);
		}
	}, [id, auth, dispatch, profile.users])
	useEffect(() => {
		if (showFollowers || showFollowing || onEdit) {
			dispatch({ type: GLOBALTYPES.MODAL, payload: true })
		} else {
			dispatch({ type: GLOBALTYPES.MODAL, payload: false })
		}
	}, [showFollowers, setShowFollowing, onEdit, dispatch])
	return (
		<div className='info'>
			{
				userData.map(user => (
					<div className='info_container' key={user._id}>
						<Avatar src={user.avatar} size='supper-avatar' />
						<div className="info_content">
							<div className="info_content_title">
								<h2>{user.userName}</h2>
								{
									user._id === auth.user._id ? <button className='btn btn-outline-danger' style={{ filter: theme ? 'invert(1)' : 'invert(0)' }} onClick={() => setOnEdit(true)}>Edit Profile</button> : <FollowBtn user={user} />
								}
							</div>
							<div className="follow_btn">
								<span className='me-4' style={{ filter: theme ? 'invert(1)' : 'invert(0)' }} onClick={() => setShowFollowers(true)}>
									{user.followers.length} Followers
								</span>
								<span className='ms-1' style={{ filter: theme ? 'invert(1)' : 'invert(0)' }} onClick={() => setShowFollowing(true)}>
									{user.following.length} Following
								</span>
							</div>
							<h6 >{user.yourName}</h6>
							<span className="text-danger" style={{ filter: theme ? 'invert(1)' : 'invert(0)' }} >{user.phone}</span>
							<h6 className='m-0'>{user.email}</h6>
							<a href={user.website} target='_blank' rel='noreferrer' className='link-danger' style={{ filter: theme ? 'invert(1)' : 'invert(0)' }} >{user.website}</a>
							<p>{user.story}</p>

						</div>
						{
							onEdit && <EditProfile setOnEdit={setOnEdit} />
						}
						{
							showFollowers && <Followers users={user.followers} setShowFollowers={setShowFollowers} />
						}
						{
							showFollowing && <Following users={user.following} setShowFollowing={setShowFollowing} />
						}
					</div>

				))
			}
		</div>
	)
}

export default Info
