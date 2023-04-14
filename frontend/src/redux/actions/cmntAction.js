import { DeleteData, EditData, GLOBALTYPES } from "./globalTypes";
import { POST_TYPES } from "./postAction";
import { deleteDataAPI, patchDataAPI, postDataAPI } from "../../utils/fetchData";
import { createNotify, removeNotify } from "./notifyAction";
export const createCmnt = ({ post, newCmnt, auth, socket }) => async (dispatch) => {
	const newPost = { ...post, comments: [...post.comments, newCmnt] }
	dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost })
	try {
		const data = { ...newCmnt, postId: post._id, postUserId: post.user._id }
		const res = await postDataAPI('comment', data, auth.token)
		const newData = { ...res.data.newCmnt, user: auth.user }
		const newPost = { ...post, comments: [...post.comments, newData] }
		dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost })
		socket.emit('createComment', newPost)
		const msg = {
			id: res.data.newCmnt._id,
			text: newCmnt.reply ? ' mentioned you in a comment' : ' has commented on your post',
			recipients: newCmnt.reply ? [newCmnt.tag._id] : [post.user._id],
			url: `/post/${post._id}`,
			content: post.content,
			img: post.imgs[0].url
		}
		dispatch(createNotify({ msg, auth, socket }))
	} catch (err) {
		dispatch({ type: GLOBALTYPES.ALERT, payload: { err: err.response.data.msg } })

	}
}

export const updateCmnt = ({ comment, post, content, auth }) => async (dispatch) => {
	const newCmnt = EditData(post.comments, comment._id, { ...comment, content })
	const newPost = { ...post, comments: newCmnt }
	dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost })
	try {
		patchDataAPI(`comment/${comment._id}`, { content }, auth.token)
	} catch (err) {
		dispatch({ type: GLOBALTYPES.ALERT, payload: { err: err.response.data.msg } })
	}
}

export const likeCmnt = ({ comment, post, auth, socket }) => async (dispatch) => {
	const newComment = { ...comment, likes: [...comment.likes, auth.user] }

	const newComments = EditData(post.comments, comment._id, newComment)

	const newPost = { ...post, comments: newComments }

	dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost })

	try {
		await patchDataAPI(`comment/${comment._id}/like`, null, auth.token)
		const msg = {
			id: auth.user._id,
			text: 'liked your comment',
			recipients: [post.user._id],
			url: `/post/${post._id}`,
			content: comment.content,
			img: post.imgs[0].url
		}
		dispatch(createNotify({ msg, auth, socket }))
	} catch (err) {
		dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err.response.data.msg } })
	}
}

export const unLikeCmnt = ({ comment, post, auth, socket }) => async (dispatch) => {
	const newCmnt = { ...comment, likes: DeleteData(comment.likes, auth.user._id) }
	const newCmnts = EditData(post.comments, comment._id, newCmnt)
	const newPost = { ...post, comments: newCmnts }
	dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost })
	try {
		await patchDataAPI(`comment/${comment._id}/unlike`, null, auth.token)
		const msg = {
			id: auth.user._id,
			text: 'liked your comment',
			recipients: [post.user._id],
			url: `/post/${post._id}`,
			content: comment.content,
			img: post.imgs[0].url
		}
		dispatch(removeNotify({ msg, auth, socket }))
	} catch (err) {
		dispatch({ type: GLOBALTYPES.ALERT, payload: { err: err.response.data.msg } })
	}
}

export const deleteCmnt = ({ post, comment, auth, socket }) => async (dispatch) => {
	const deleteArr = [...post.comments.filter(cm => cm.reply === comment._id), comment]
	const newPost = {
		...post,
		comments: post.comments.filter(cm => !deleteArr.find(da => cm._id === da._id))
	}
	dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost })
	socket.emit('deleteCmnt', newPost)
	try {
		deleteArr.forEach(item => {
			deleteDataAPI(`/comment/${item._id}`, auth.token)
			const msg = {
				id: item._id,
				text: comment.reply ? ' mentioned you in a comment' : ' has commented on your post',
				recipients: comment.reply ? [comment.tag._id] : [post.user._id],
				url: `/post/${post._id}`,
			}
			dispatch(removeNotify({ msg, auth, socket }))
		})
	} catch (err) {
		dispatch({ type: GLOBALTYPES.ALERT, payload: { err: err.response.data.msg } })
	}
}