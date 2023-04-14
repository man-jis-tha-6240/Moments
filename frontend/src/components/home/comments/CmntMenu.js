import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteCmnt } from '../../../redux/actions/cmntAction'

const CmntMenu = ({ post, comment, setOnEdit }) => {
	const { auth,socket } = useSelector(state => state)
	const dispatch = useDispatch()
	const handleRemoove = () => {
		if(post.user._id===auth.user._id|| comment.user._id===auth.user._id) {

			dispatch(deleteCmnt({ post, comment, auth,socket }))
		}
	}
	const MenuItem = () => {
		return (
			<>
				<div className="dropdown-item" onClick={() => setOnEdit(true)}>
					<span className='material-icons'>edit</span>Edit
				</div>
				<div className="dropdown-item">
					<span className='material-icons' onClick={handleRemoove}>delete</span>Delete
				</div>
			</>
		)
	}
	return (
		<div className='cmnt-menu'>
			{
				(post.user._id === auth.user._id || comment.user._id === auth.user._id) &&
				<div className="nav-item dropdown">
					<span className='material-icons' id='moreLink' data-bs-toggle='dropdown'>more_vert</span>
					<div className="dropdown-menu" aria-labelledby='moreLink'>
						{
							post.user._id === auth.user._id ? comment.user._id === auth.user._id
								? MenuItem()
								: <div className="dropdown-item">
									<span className='material-icons' onClick={handleRemoove}>delete</span>Delete
								</div>
								: comment.user._id === auth.user._id && MenuItem()
						}
					</div>
				</div>
			}
		</div>
	)
}

export default CmntMenu
