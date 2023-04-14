import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { GLOBALTYPES } from '../../redux/actions/globalTypes'
import Avatar from '../Avatar'
import { addMessage } from '../../redux/actions/msgAction'
import Ringtone from '../../sound/Ringtone.mp3'
const CallModal = () => {
	const { theme, call, auth, peer, socket } = useSelector(state => state)
	const dispatch = useDispatch()
	const [mins, setMins] = useState(0)
	const [secs, setSecs] = useState(0)
	const [hours, setHours] = useState(0)
	const [total, setTotal] = useState(0)
	const [answer, setAnswer] = useState(false)
	const [tracks, setTracks] = useState(null)
	const [newCall, setNewCall] = useState(null)
	const youVid = useRef()
	const otherVid = useRef()
	useEffect(() => {
		const setTime = () => {
			setTotal(t => t + 1)
			setTimeout(setTime, 1000)
		}
		setTime()
		return () => setTotal(0)
	}, [])
	useEffect(() => {
		setSecs(total % 60)
		setMins(parseInt(total / 60))
		setHours(parseInt(total / 3600))
	}, [total])
	const addCallMessage = useCallback((call, times, disconnect) => {
		if (call.recipient !== auth.user._id || disconnect) {
			const msg = {
				sender: call.sender,
				recipient: call.recipient,
				text: '',
				media: [],
				call: { video: call.video, times },
				createdAt: new Date().toISOString()
			}
			dispatch(addMessage({ msg, auth, socket }))
		}
	}, [auth, dispatch, socket])
	const handleEndCall = () => {
		tracks && tracks.forEach(track => track.stop())
		if (newCall) {
			newCall.close()
		}
		let times = answer ? total : 0
		socket.emit('endCall', { ...call, times })
		addCallMessage(call, times)
		dispatch({ type: GLOBALTYPES.CALL, payload: null })
	}
	useEffect(() => {
		if (answer) {
			setTotal(0)
		} else {
			const timer = setTimeout(() => {
				socket.emit('endCall', { ...call, times: 0 })
				addCallMessage(call, 0)
				dispatch({ type: GLOBALTYPES.CALL, payload: null })
			}, 15000);
			return () => clearTimeout(timer)
		}
	}, [dispatch, answer, call, socket, addCallMessage])
	useEffect(() => {
		socket.on('endCallToClient', data => {
			tracks && tracks.forEach(track => track.stop())
			if (newCall) {
				newCall.close()
			}
			addCallMessage(data, data.times)
			dispatch({ type: GLOBALTYPES.CALL, payload: null })
		})
		return () => socket.off('endCallToClient')
	}, [socket, dispatch, tracks, addCallMessage, newCall])
	const openStream = (video) => {
		const config = { audio: true, video }
		return navigator.mediaDevices.getUserMedia(config)
	}
	const playStream = (tag, stream) => {
		let video = tag
		video.srcObject = stream
		video.play()
	}
	const handleAnswer = () => {
		openStream(call.video).then(stream => {
			playStream(youVid.current, stream)
			const track = stream.getTracks()
			setTracks(track)
			const newCall = peer.call(call.peerId, stream)
			newCall.on('stream', function (remoteStream) {
				playStream(otherVid.current, remoteStream)
			})
			setAnswer(true)
			setNewCall(newCall)
		})
	}
	useEffect(() => {
		peer.on('call', newCall => {
			openStream(call.video).then(stream => {
				if (youVid.current) {
					playStream(youVid.current, stream)
				}
				const track = stream.getTracks()
				setTracks(track)
				newCall.answer(stream)
				newCall.on('stream', function (remoteStream) {
					if (otherVid.current) {
						playStream(otherVid.current, remoteStream)
					}
				})
				setAnswer(true)
			})
		})
		return () => peer.removeListener('call')
	}, [peer, call.video])
	useEffect(() => {
		socket.on('callerDisconnect', () => {
			tracks && tracks.forEach(track => track.stop())
			if (newCall) {
				newCall.close()
			}
			let times = answer ? total : 0
			addCallMessage(call, times, true)
			dispatch({ type: GLOBALTYPES.CALL, payload: null })
			dispatch({ type: GLOBALTYPES.ALERT, payload: { err: `${call.userName} disconnected` } })
		})
		return () => socket.off('callerDisconnect')
	}, [socket, tracks, dispatch, call, addCallMessage, answer, total, newCall])
	const playAudio = (newAudio) => {
		newAudio.play()
	}
	const pauseAudio = (newAudio) => {
		newAudio.pause()
		newAudio.currentTime = 0
	}
	useEffect(() => {
		let newAudio = new Audio(Ringtone)
		if (answer) {
			pauseAudio(newAudio)
		} else {
			playAudio(newAudio)
		}
		return () => pauseAudio(newAudio)
	}, [answer])
	return (
		<div className='call-modal'>
			<div className="call-box" style={{ display: (answer && call.video) ? 'none' : 'flex', backgroundColor: theme ? 'rgb(145, 168, 164)' : '' }}>
				<div className='text-center' style={{ padding: '40px 0' }}>
					<Avatar src={call.avatar} size='supper-avatar' />
					<h4>{call.userName}</h4>
					<h6>{call.yourName}</h6>

					{
						answer
							? <div>
								<span>{hours.toString().length < 2 ? '0' + hours : hours}</span>
								<span> : </span>
								<span>{mins.toString().length < 2 ? '0' + mins : mins}</span>
								<span> : </span>
								<span>{secs.toString().length < 2 ? '0' + secs : secs}</span>
							</div>
							: <div >
								{
									call.video
										? <span>Calling video...</span>
										: <span>Calling audio...</span>
								}
							</div>
					}
				</div>
				{
					!answer &&
					<div className="timer">
						<small>{mins.toString().length < 2 ? '0' + mins : mins}</small>
						<small> : </small>
						<small>{secs.toString().length < 2 ? '0' + secs : secs}</small>
					</div>
				}

				<div className="call-menu" >
					<button className='material-icons text-danger' style={{ cursor: 'pointer', filter: theme ? 'invert(1)' : 'invert(0)' }} onClick={handleEndCall}>call_end</button>
					{
						(call.recipient === auth.user._id && !answer) &&
						<>
							{
								call.video
									? <button className='material-icons text-success' style={{ cursor: 'pointer', filter: theme ? 'invert(1)' : 'invert(0)' }} onClick={handleAnswer}>videocam</button>
									: <button className='material-icons text-success' style={{ cursor: 'pointer', filter: theme ? 'invert(1)' : 'invert(0)' }} onClick={handleAnswer}>call</button>

							}
						</>
					}
				</div>
			</div>
			<div className="show-vid" style={{ opacity: (answer && call.video) ? '1' : '0', filter: theme ? 'invert(1)' : 'invert(0)' }}>
				<video ref={youVid} className='you-vid' playsInline muted />
				<video ref={otherVid} className='other-vid' playsInline />
				<div className='time-vid'>
					<span>{hours.toString().length < 2 ? '0' + hours : hours}</span>
					<span> : </span>
					<span>{mins.toString().length < 2 ? '0' + mins : mins}</span>
					<span> : </span>
					<span>{secs.toString().length < 2 ? '0' + secs : secs}</span>
				</div>
				<button className='material-icons text-danger end-call' style={{ cursor: 'pointer' }} onClick={handleEndCall}>call_end</button>
			</div>
		</div>
	)
}

export default CallModal
