import { GLOBALTYPES } from "./globalTypes";
import { imageUpload } from "../../utils/ImageUpload";
import { getDataAPI, postDataAPI, patchDataAPI, deleteDataAPI } from "../../utils/fetchData";
import { createNotify, removeNotify } from "./notifyAction";
export const POST_TYPES = {
	CREATE_POST: 'CREATE_POST',
	LOADING_POST: 'LOADING_POST',
	GET_POST: 'GET_POST',
	UPDATE_POST: 'UPDATE_POST',
	GET_SINGLE_POST: 'GET_SINGLE_POST',
	DELETE_POST: 'DELETE_POST'
}
export const createPost = ({ content, imgs, auth, socket }) => async (dispatch) => {
	let media = []
	try {
		dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } })
		if (imgs.length > 0) {
			media = await imageUpload(imgs)
		}
		const res = await postDataAPI('posts', { content, imgs: media }, auth.token)
		dispatch({ type: POST_TYPES.CREATE_POST, payload: { ...res.data.newPost, user: auth.user } })
		dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: false } })

		const msg = {
			id: res.data.newPost._id,
			text: 'added a new post',
			recipients: res.data.newPost.user.followers,
			url: `/post/${res.data.newPost._id}`,
			content,
			img: media[0].url
		}
		dispatch(createNotify({ msg, auth, socket }))
	} catch (err) {
		dispatch({ type: GLOBALTYPES.ALERT, payload: { err: err.response.data.msg } });
	}
}
export const getPost = (token) => async (dispatch) => {
	try {
		dispatch({ type: POST_TYPES.LOADING_POST, payload: true })
		const res = await getDataAPI('posts', token)
		dispatch({
			type: POST_TYPES.GET_POST,
			payload: { ...res.data, page: 2 }
		})
		dispatch({ type: POST_TYPES.LOADING_POST, payload: false })
	} catch (err) {
		dispatch({ type: GLOBALTYPES.ALERT, payload: { err: err.response.data.msg } });

	}
}
export const updatePost = ({ content, imgs, auth, status }) => async (dispatch) => {
	let media = []
	const imgNewUrl = imgs.filter(img => !img.url)
	const imgOldUrl = imgs.filter(img => img.url)
	if (status.content === content && imgNewUrl.length === 0 && imgOldUrl.length === status.imgs.length) {
		return;
	}
	try {
		dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } })
		if (imgNewUrl.length > 0) {
			media = await imageUpload(imgNewUrl)
		}
		const res = await patchDataAPI(`post/${status._id}`, { content, imgs: [...imgOldUrl, ...media] }, auth.token)
		console.log(res);
		dispatch({ type: POST_TYPES.UPDATE_POST, payload: res.data.newPost })
		dispatch({ type: GLOBALTYPES.ALERT, payload: { success: res.data.msg } })

	} catch (err) {
		dispatch({ type: GLOBALTYPES.ALERT, payload: { err: err.response.data.msg } });
	}
}
export const likePost = ({ post, auth, socket }) => async (dispatch) => {
	const newPost = { ...post, likes: [...post.likes, auth.user] }
	dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost })
	socket.emit('likePost', newPost)
	try {
		await patchDataAPI(`post/${post._id}/like`, null, auth.token)
		const msg = {
			id: auth.user._id,
			text: 'liked your post',
			recipients: [post.user._id],
			url: `/post/${post._id}`,
			content: post.content,
			img: post.imgs[0].url
		}
		dispatch(createNotify({ msg, auth, socket }))
	} catch (err) {
		dispatch({ type: GLOBALTYPES.ALERT, payload: { err: err.response.data.msg } });

	}
}
export const unLikePost = ({ post, auth, socket }) => async (dispatch) => {
	const newPost = { ...post, likes: post.likes.filter(like => like._id !== auth.user._id) }
	dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost })
	socket.emit('unLikePost', newPost)
	try {
		await patchDataAPI(`post/${post._id}/unlike`, null, auth.token)
		const msg = {
			id: auth.user._id,
			text: 'disliked your post',
			recipients: [post.user._id],
			url: `/post/${post._id}`,
		}
		dispatch(removeNotify({ msg, auth, socket }))
	} catch (err) {
		dispatch({ type: GLOBALTYPES.ALERT, payload: { err: err.response.data.msg } });

	}
}
export const getSinglePost = ({ detailPost, id, auth }) => async (dispatch) => {
	if (detailPost.every(post => post._id !== id)) {
		try {
			const res = await getDataAPI(`post/${id}`, auth.token)
			dispatch({ type: POST_TYPES.GET_SINGLE_POST, payload: res.data.post })
		}
		catch (err) {
			dispatch({ type: GLOBALTYPES.ALERT, payload: { err: err.response.data.msg } });
		}
	}
}
export const deletePost = ({ post, auth, socket }) => async (dispatch) => {
	dispatch({ type: POST_TYPES.DELETE_POST, payload: post })
	try {
		const res = await deleteDataAPI(`post/${post._id}`, auth.token)
		const msg = {
			id: post._id,
			text: 'added a new post',
			recipients: res.data.newPost.user.followers,
			url: `/post/${post._id}`,
		}
		dispatch(removeNotify({ msg, auth, socket }))
	} catch (err) {
		dispatch({ type: GLOBALTYPES.ALERT, payload: { err: err.response.data.msg } });
	}
}
export const savePost = ({ post, auth }) => async (dispatch) => {
	const newUser = { ...auth.user, saved: [...auth.user.saved, post._id] }
	dispatch({ type: GLOBALTYPES.AUTH, payload: { ...auth, user: newUser } })
	try {
		await patchDataAPI(`savePost/${post._id}`, null, auth.token)
	} catch (err) {
		dispatch({ type: GLOBALTYPES.ALERT, payload: { err: err.response.data.msg } });

	}
}
export const unSavePost = ({ post, auth }) => async (dispatch) => {
	const newUser = { ...auth.user, saved: auth.user.saved.filter(id => id !== post._id) }
	dispatch({ type: GLOBALTYPES.AUTH, payload: { ...auth, user: newUser } })
	try {
		await patchDataAPI(`unSavePost/${post._id}`, null, auth.token)
	} catch (err) {
		dispatch({ type: GLOBALTYPES.ALERT, payload: { err: err.response.data.msg } });

	}
}