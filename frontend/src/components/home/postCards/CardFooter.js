import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import send from '../../../imgs/send.svg'
import { useSelector, useDispatch } from 'react-redux'
import LikeBtn from '../../LikeBtn'
import { likePost, savePost, unLikePost, unSavePost } from '../../../redux/actions/postAction'
import ShareModal from '../../ShareModal'
import { BASE_URL } from '../../../utils/config'
const CardFooter = ({ post }) => {
	const dispatch = useDispatch()
	const { auth, theme, socket } = useSelector(state => state)
	const [isLike, setIsLike] = useState(false)
	const [loadLike, setLoadLike] = useState(false)
	const [isShare, setIsShare] = useState(false)
	const [saved, setSaved] = useState(false)
	const [saveLoad, setSaveLoad] = useState(false)
	const handleSave = () => {
		if (saveLoad) {
			return;
		}
		setSaveLoad(true)
		dispatch(savePost({ post, auth }))
		setSaveLoad(false)
	}
	const handleUnSave = () => {
		if (saveLoad) {
			return;
		}
		setIsLike(false)
		setSaveLoad(true)
		dispatch(unSavePost({ post, auth }))
		setSaveLoad(false)
	}
	const handleLike = () => {
		if (loadLike) {
			return;
		}

		setLoadLike(true)
		dispatch(likePost({ post, auth, socket }))
		setLoadLike(false)
	}
	const handleUnLike = () => {
		if (loadLike) {
			return;
		}
		setIsLike(false)
		setLoadLike(true)
		dispatch(unLikePost({ post, auth, socket }))
		setLoadLike(false)
	}
	useEffect(() => {
		if (post.likes.find(like => like._id === auth.user._id)) {
			setIsLike(true)
		}
		else {
			setIsLike(false)
		}
	}, [post.likes, auth.user._id])
	useEffect(() => {
		if (auth.user.saved.find(id => id === post._id)) {
			setSaved(true)
		}
		else {
			setSaved(false)
		}
	}, [auth.user.saved, post._id])
	return (
		<div className='card-footer'>
			<div className="card-icon-menu">
				<div>
					<LikeBtn isLike={isLike} handleLike={handleLike} handleUnLike={handleUnLike} />
					<Link to={`/post/${post._id}`} className='text-dark'>
						<i className="far fa-comment" />
					</Link>
					<img onClick={() => setIsShare(!isShare
					)} style={{ cursor: 'pointer' }} src={send} alt="" />
				</div>
				{
					saved
						? <i className='fas fa-bookmark text-secondary' onClick={handleUnSave} />
						: <i className='far fa-bookmark' onClick={handleSave} />
				}
			</div>
			<div className="d-flex justify-content-between">
				<h6 style={{ padding: '0 34px', cursor: 'pointer' }}>{post.likes.length} likes</h6>
				<h6 style={{ padding: '0 25px', cursor: 'pointer' }}>{post.comments.length} comment</h6>
			</div>
			{
				isShare &&
				<ShareModal url={`${BASE_URL}/post/${post._id}`} theme={theme} />
			}
		</div>
	)
}

export default CardFooter
