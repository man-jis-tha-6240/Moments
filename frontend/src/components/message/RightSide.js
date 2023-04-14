import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import UserCard from '../UserCard'
import MessageDisplay from './MessageDisplay'
import Icons from '../Icons'
import { checkImg, imageUpload } from '../../utils/ImageUpload'
import { GLOBALTYPES } from '../../redux/actions/globalTypes'
import { imgShow, videoShow } from '../../utils/mediaShow'
import { addMessage, deleteConvo, getMessage, loadMoreMessages } from '../../redux/actions/msgAction'
import LoadIcon from '../../imgs/loading.gif'
const RightSide = () => {
	const { auth, message, theme, socket, peer } = useSelector(state => state)
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const { id } = useParams()
	const [user, setUser] = useState([])
	const [text, setText] = useState('')
	const [media, setMedia] = useState([])
	const [loadMedia, setLoadMedia] = useState(false)
	const [page, setPage] = useState(0)
	const [data, setData] = useState([])
	const [result, setResult] = useState(9)
	const [isLoadMore, setIsLoadMore] = useState(0)
	const refDisplay = useRef()
	const pageEnd = useRef()
	const handleDeleteConvo = () => {
		dispatch(deleteConvo({ auth, id }))
		navigate('/message')
	}
	const caller = ({ video }) => {
		const { _id, avatar, userName, yourName } = user
		const msg = {
			sender: auth.user._id,
			recipient: _id,
			avatar, userName, yourName, video
		}
		dispatch({ type: GLOBALTYPES.CALL, payload: msg })
	}
	const callUser = ({ video }) => {
		const { _id, avatar, userName, yourName } = auth.user
		const msg = {
			sender: _id,
			recipient: user._id,
			avatar, userName, yourName, video
		}
		if (peer.open) {
			msg.peerId = peer._id
		}
		socket.emit('callUser', msg)
	}
	useEffect(() => {
		const newData = message.data.find(item => item._id === id)
		if (newData) {
			setData(newData.messages)
			setResult(newData.result)
			setPage(newData.page)
		}
	}, [message.data, id])
	useEffect(() => {
		if (id && message.users.length > 0) {
			setTimeout(() => {
				refDisplay.current.scrollIntoView({ behaviour: 'smooth', block: 'end' })
			}, 50);
			const newUser = message.users.find(user => user._id === id)
			if (newUser) {
				setUser(newUser)

			}
		}
	}, [message.users, id])
	const handleChange = (e) => {
		const files = [...e.target.files]
		let newMedia = []
		files.forEach(file => {
			const err = checkImg(file);
			if (err) {
				dispatch({ type: GLOBALTYPES.ALERT, payload: { err: err } })
			}
			return newMedia.push(file)
		})
		setMedia([...media, ...newMedia])
	}
	const deleteImgs = (index) => {
		const newArr = [...media]
		newArr.splice(index, 1)
		setMedia(newArr)
	}
	const handleSubmit = async (e) => {
		e.preventDefault()
		if (!text.trim() && media.length === 0) {
			return
		}
		setText('')
		setMedia([])
		setLoadMedia(true)
		let newArr = []
		if (media.length > 0) {
			newArr = await imageUpload(media)
		}
		const msg = {
			sender: auth.user._id,
			recipient: id,
			text,
			media: newArr,
			createdAt: new Date().toISOString()
		}
		setLoadMedia(false)
		await dispatch(addMessage({ msg, auth, socket }))
		if (refDisplay.current) {
			refDisplay.current.scrollIntoView({ behaviour: 'smooth', block: 'end' })
		}
	}
	const handleAudioCall = () => {
		caller({ video: false })
		callUser({video: false})
	}
	const handleVideoCall = () => {
		caller({ video: true })
		callUser({video: true})
	}
	useEffect(() => {
		if (id) {
			const getMessageData = async () => {
				if (message.data.every(item => item._id !== id)) {
					await dispatch(getMessage({ auth, id }))
					setTimeout(() => {
						refDisplay.current.scrollIntoView({ behaviour: 'smooth', block: 'end' })
					}, 50);
				}
			}
			getMessageData()
		}
	}, [id, dispatch, auth, message.data])
	//load more
	useEffect(() => {
		const observer = new IntersectionObserver(entries => {
			if (entries[0].isIntersecting) {
				setIsLoadMore(p => p + 1)
			}
		}, {
			threshold: 0.1
		})
		observer.observe(pageEnd.current)
	}, [setIsLoadMore])
	useEffect(() => {
		if (isLoadMore > 1) {
			if (result >= page * 9) {
				dispatch(loadMoreMessages({ auth, id, page: page + 1 }))
				setIsLoadMore(1)
			}
		}
		// eslint-disable-next-line
	}, [isLoadMore])

	return (
		<>
			<div className='msg_header'>
				{
					user.length !== 0 &&
					<UserCard user={user}>
						<div>
							<i className='fas fa-phone-alt ' style={{ marginTop: '15px', color: 'rgb(228, 162, 175)', cursor: 'pointer', filter: theme ? 'invert(1)' : 'invert(0)' }} onClick={handleAudioCall} />

							<i className='fas fa-video mx-3' style={{ marginTop: '15px', color: 'rgb(228, 162, 175)', cursor: 'pointer', filter: theme ? 'invert(1)' : 'invert(0)' }} onClick={handleVideoCall} />

							<i className='fas fa-trash ' style={{ marginTop: '15px', color: 'rgb(228, 162, 175)', cursor: 'pointer', filter: theme ? 'invert(1)' : 'invert(0)' }} onClick={handleDeleteConvo} />
						</div>
					</UserCard>
				}
			</div>
			<div className="chat-container" style={{ height: media.length > 0 ? 'calc(100%-180px)' : '' }}>
				<div className="chat-display" ref={refDisplay}>
					<button style={{ marginTop: '-25px' }} ref={pageEnd}>Load more</button>
					{
						data.map((msg, index) => (
							<div key={index}>
								{
									msg.sender !== auth.user._id &&
									<div className="chat-row other-msg">
										<MessageDisplay user={user} msg={msg} theme={theme} />
									</div>
								}
								{
									msg.sender === auth.user._id &&
									<div className="chat-row you-msg">
										<MessageDisplay user={auth.user} msg={msg} theme={theme} data={data} />
									</div>
								}
							</div>
						))
					}
					{
						loadMedia &&
						<div className="chat-row you-msg">
							<img src={LoadIcon} alt="loading" />
						</div>
					}
				</div>
			</div>
			<div className="show-media" style={{ display: media.length > 0 ? 'grid' : 'none' }}>
				{
					media.map((item, index) => (
						<div key={index} id='file-media'>
							{
								item.type.match(/video/i) ? videoShow(URL.createObjectURL(item), theme) : imgShow(URL.createObjectURL(item), theme)
							}
							<span style={{ filter: theme ? 'invert(1)' : 'invert(0)' }} onClick={() => deleteImgs(index)}>&times;</span>

						</div>
					))
				}
			</div>
			<form className='chat-input' onSubmit={handleSubmit}>
				<input type="text" placeholder='Message' value={text} onChange={e => setText(e.target.value)} style={{ filter: theme ? 'invert(1)' : 'invert(0)', background: theme ? 'black' : 'white', color: theme ? 'white' : 'black' }} />
				<Icons setContent={setText} content={text} theme={theme} />
				<div className="file-upload">
					<i className='fas fa-image' />
					<input type="file" name="file" id="file" multiple accept='image/*,video/*' onChange={handleChange} />
				</div>
				<button type="submit" disabled={(text || media.length > 0) ? false : true} className='material-icons' style={{ filter: theme ? 'invert(1)' : 'invert(0)', background: theme ? 'black' : 'white' }}>near_me</button>
			</form>
		</>
	)
}

export default RightSide