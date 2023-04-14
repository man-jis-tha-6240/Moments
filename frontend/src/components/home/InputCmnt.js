import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createCmnt } from '../../redux/actions/cmntAction'
import Icons from '../Icons'
const InputCmnt = ({ children, post, onReply, setOnReply }) => {
	const { auth, socket, theme } = useSelector(state => state)
	const dispatch = useDispatch()
	const [content, setContent] = useState('')
	const handleSubmit = (e) => {
		e.preventDefault();
		if (!content.trim()) {
			if (setOnReply) {
				return setOnReply(false)
			}
			return
		}
		setContent('')
		const newCmnt = {
			content,
			likes: [],
			user: auth.user,
			createdAt: new Date().toISOString(),
			reply: onReply && onReply.cmntId,
			tag: onReply && onReply.user
		}

		dispatch(createCmnt({ post, newCmnt, auth, socket }))
		if (setOnReply) {
			return setOnReply(false)
		}
	}
	return (
		<form className='card-footer cmntInp' onSubmit={handleSubmit}>
			{children}
			<input type="text" placeholder='Add comment' value={content} onChange={e => setContent(e.target.value)} />
			<Icons setContent={setContent} content={content} theme={theme} />
			<button type="submit" className='postCmntBtn' style={{ filter: theme ? 'invert(1)' : 'invert(0)', color: theme ? 'rgb(238, 57, 148)' : 'rgb(238, 57, 148)', background: theme ? 'black' : 'white' }}>Post</button>
		</form>
	)
}

export default InputCmnt
