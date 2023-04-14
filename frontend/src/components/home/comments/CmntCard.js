import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import Avatar from '../../Avatar'
import moment from 'moment'
import LikeBtn from '../../LikeBtn'
import CmntMenu from './CmntMenu'
import InputCmnt from '../InputCmnt'
import { likeCmnt, unLikeCmnt, updateCmnt } from '../../../redux/actions/cmntAction'
const CmntCard = ({ children, comment, post, cmntId }) => {
	const { auth, theme, socket } = useSelector(state => state)
	const dispatch = useDispatch()
	const [content, setContent] = useState('')
	const [readMore, setReadMore] = useState(false)
	const [isLike, setIsLike] = useState(false)
	const [loadLike, setLoadLike] = useState(false)
	const [onEdit, setOnEdit] = useState(false)
	const [onReply, setOnReply] = useState(false)

	const styleCard = {
		opacity: comment._id ? 1 : 0.5,
		pointerEvents: comment._id ? 'inherit' : 'none'
	}
	const handleLike = () => {
		if (loadLike) {
			return;
		}
		setIsLike(true)
		setLoadLike(true)
		dispatch(likeCmnt({ comment, post, auth, socket }))
		setLoadLike(false)
	}
	const handleUnLike = () => {
		if (loadLike) {
			return;
		}
		setIsLike(false)
		setLoadLike(true)
		dispatch(unLikeCmnt({ comment, post, auth, socket }))
		setLoadLike(false)
	}
	const handleCmntUppdate = () => {
		if (comment.content !== content) {
			dispatch(updateCmnt({ comment, post, content, auth }))
			setOnEdit(false);
		}
		else {
			setOnEdit(false);
		}
	}
	const handleRply = () => {
		if (onReply) {
			return setOnReply(false);
		}
		setOnReply({ ...comment, cmntId });
	}
	useEffect(() => {
		setContent(comment.content)
		setIsLike(false)
		setOnReply(false)
		if (comment.likes.find(like => like._id === auth.user._id)) {
			setIsLike(true)
		}
	}, [comment, auth.user._id])

	return (
		<div className='comment-card mt-2' style={styleCard}>
			<Link to={`/profile/${comment.user._id}`} className='d-flex text-dark'>
				<Avatar src={comment.user.avatar} size='low-avatar' />
				<h6 className='mx-1'>{comment.user.userName}</h6>
			</Link>
			<div className="comment-content">
				<div className="flex-fill" style={{filter: theme ? 'invert(1)' : 'invert(0)',color:theme?'white':'black'}}>
					{
						onEdit
							? <textarea rows={5} value={content} onChange={e => setContent(e.target.value)} />
							: <div>
								{
									comment.tag && comment.tag._id !== comment.user._id &&
									<Link to={`/profile/${comment.tag._id}`} className='mr-1' style={{ filter: theme ? 'invert(1)' : 'invert(0)', color: theme ? 'golden' : 'blue' }}>
										@{comment.tag.userName}
									</Link>
								}
								<span>
									{
										content.length < 100 ? content :
											readMore ? content + ' ' : content.slice(0, 100) + '...'
									}
								</span>
								{
									content.length > 100 &&
									<span className="readMore" onClick={() => setReadMore(!readMore)}>
										{readMore ? ' Hide' : 'Read More'}
									</span>
								}
							</div>
					}
					<div style={{ cursor: 'pointer' }}>
						<small className='tex-muted me-3'>
							{
								moment(comment.createdAt).fromNow()
							}
						</small>
						<small className='fw-bold me-3'>
							{
								comment.likes.length
							} likes
						</small>
						{
							onEdit
								? <>
									<small className='fw-bold me-3' onClick={handleCmntUppdate}>
										Update comment
									</small>
									<small className='fw-bold me-3' onClick={() => setOnEdit(false)}>
										Cancel
									</small>
								</>
								: <small className='fw-bold me-3' onClick={handleRply}>
									{onReply ? 'cancel' : 'reply'}
								</small>
						}
					</div>
				</div>
				<div className='d-flex align-items-center' style={{ cursor: 'pointer' }}>
					<LikeBtn isLike={isLike} handleLike={handleLike} handleUnLike={handleUnLike} />

					<CmntMenu post={post} comment={comment} setOnEdit={setOnEdit} />
				</div>
			</div>
			{
				onReply &&
				<InputCmnt post={post} onReply={onReply} setOnReply={setOnReply}>
					<Link
						to={`/profile/${onReply.user._id}`} className='me-1 text-dark' >
						@{onReply.user.userName}:
					</Link>
				</InputCmnt>
			}
			{children}
		</div>
	)
}

export default CmntCard
