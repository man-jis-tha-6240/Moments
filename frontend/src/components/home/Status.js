import React from 'react'
import Avatar from '../Avatar'
import { useSelector, useDispatch } from 'react-redux'
import { GLOBALTYPES } from '../../redux/actions/globalTypes'
const Status = () => {
	const { auth } = useSelector(state => state)
	const dispatch = useDispatch();
	return (
		<div className='status my-3 d-flex'>
			<Avatar src={auth.user.avatar} size='big-avatar' />
			<button className='status-btn flex-fill' onClick={() => dispatch({ type: GLOBALTYPES.STATUS, payload: true })}>
				{auth.user.userName}, What's on your mind?
			</button>
		</div>
	)
}

export default Status
