import React, { useEffect, useState } from 'react'
import Info from '../../components/profile/Info'
import Post from '../../components/profile/Post'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'

import loading from '../../imgs/loading.gif'
import { getProfileUsers } from '../../redux/actions/profileAction'
import Saved from './Saved'
const Profile = () => {
	const { profile, auth, theme } = useSelector(state => state)
	const { id } = useParams()
	const dispatch = useDispatch()
	const [savedPosts, setSavedPosts] = useState(false)
	useEffect(() => {
		if (profile.ids.every(item => item !== id)) {
			dispatch(getProfileUsers({ id, auth }))
		}
	}, [id, auth, dispatch, profile.ids])
	return (
		<div className='profile'>

			<Info auth={auth} profile={profile} dispatch={dispatch} id={id} />
			{
				auth.user._id === id &&
				<div className='profile-tab'>
					<button className={savedPosts ? '' : 'active'} onClick={() => setSavedPosts(false)} style={{ filter: theme ? 'invert(1)' : 'invert(0)', background: theme ? 'black' : 'white', color: theme ? 'white' : 'black' }} >Posts</button>
					<button className={savedPosts ? 'active' : ''} onClick={() => setSavedPosts(true)} style={{ filter: theme ? 'invert(1)' : 'invert(0)', background: theme ? 'black' : 'white', color: theme ? 'white' : 'black' }}  >Saved</button>
				</div>
			}
			{
				profile.loading
					? <img className='d-block mx-auto ' src={loading} alt="" />
					: <>
						{
							savedPosts
								? <Saved auth={auth} dispatch={dispatch} />
								: <Post auth={auth} profile={profile} dispatch={dispatch} id={id} />
						}
					</>
			}
		</div>
	)
}

export default Profile
