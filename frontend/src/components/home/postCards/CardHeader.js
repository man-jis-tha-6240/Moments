import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import Avatar from '../../Avatar'
import moment from 'moment'
import { GLOBALTYPES } from '../../../redux/actions/globalTypes'
import { deletePost } from '../../../redux/actions/postAction'
import { BASE_URL } from '../../../utils/config'
const CardHeader = ({ post }) => {
	const { auth, socket } = useSelector(state => state)
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const handleEdit = () => {
		dispatch({ type: GLOBALTYPES.STATUS, payload: { ...post, onEdit: true } })
	}
	const handleDeletePost = () => {
		if (window.confirm('Are you sure you want to delete this post')) {
			dispatch(deletePost({ post, auth, socket }))
			navigate('/')
		}
	}
	const handleCopy = () => {
		navigator.clipboard.writeText(`${BASE_URL}/post/${post._id}`)
	}
	return (
		<div className='card-head'>
			<div className="d-flex">
				<Avatar src={post.user.avatar} size='big-avatar' />
				<div className="card-name">
					<h6 className='m-0'>
						<Link to={`/profile/${post.user._id}`} className='text-dark'>
							{post.user.userName}
						</Link>
					</h6>
					<small className='text-muted'>{moment(post.createdAt).fromNow()}</small>
				</div>
			</div>
			<div className="nav-item dropdown">
				<span className="material-icons" data-bs-toggle="dropdown">
					more_horiz
				</span>
				<div className="dropdown-menu">
					{
						auth.user._id === post.user._id &&
						<>
							<div className="dropdown-item" onClick={handleEdit}>
								<span className='material-icons'>edit</span>Edit
							</div>
							<div className="dropdown-item" onClick={handleDeletePost}>
								<span className='material-icons'>delete</span>Delete
							</div>
						</>
					}
					<div className="dropdown-item" onClick={handleCopy}>
						<span className='material-icons'>content_copy</span>Copy Link
					</div>
				</div>
			</div>
		</div>
	)
}

export default CardHeader
