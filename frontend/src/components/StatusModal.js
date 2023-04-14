import React, { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { GLOBALTYPES } from '../redux/actions/globalTypes';
import { createPost, updatePost } from '../redux/actions/postAction';
import { checkImg } from '../utils/ImageUpload';
import { imgShow,videoShow } from '../utils/mediaShow';
import Icons from './Icons';
const StatusModal = () => {
	const { auth, theme, status, socket } = useSelector(state => state);
	const videoRef = useRef()
	const refCanvas = useRef()
	const dispatch = useDispatch();
	const [content, setContent] = useState('');
	const [imgs, setImgs] = useState([]);
	const [stream, setStream] = useState(false);
	const [tracks, setTracks] = useState('')
	const deleteImgs = (i) => {
		const newArr = [...imgs]
		newArr.splice(i, 1)
		setImgs(newArr)
	}
	const handleChangeImg = (e) => {
		const files = [...e.target.files]
		let newImgs = []
		files.forEach(file => {
			const err = checkImg(file);
			if (err) {
				dispatch({ type: GLOBALTYPES.ALERT, payload: { err: err } })
			}
			return newImgs.push(file)
		})
		setImgs([...imgs, ...newImgs])
	}
	const handleStream = () => {
		setStream(true)
		if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
			navigator.mediaDevices.getUserMedia({ video: true }).then(mediaStream => {
				videoRef.current.srcObject = mediaStream
				videoRef.current.play()
				const track = mediaStream.getTracks()
				setTracks(track[0])
			}).catch(err => console.log(err))
		}
	}
	const handleStopStream = () => {
		tracks.stop()
		setStream(false)
	}
	const handleCapture = () => {
		const height = videoRef.current.clientHeight
		const width = videoRef.current.clientWidth
		refCanvas.current.setAttribute('width', width)
		refCanvas.current.setAttribute('height', height)
		const ctx = refCanvas.current.getContext('2d')
		ctx.drawImage(videoRef.current, 0, 0, width, height)
		let URL = refCanvas.current.toDataURL()
		setImgs([...imgs, { camera: URL }])
	}
	const handleSubmit = (e) => {
		e.preventDefault();
		if (content === '')
			return dispatch({
				type: GLOBALTYPES.ALERT, payload: { err: "Please add some content." }
			})
		if (status.onEdit) {
			dispatch(updatePost({ content, imgs, auth, status }))
		}
		else {
			dispatch(createPost({ content, imgs, auth, socket }))
		}
		setContent('')
		setImgs([])
		if (tracks) {
			tracks.stop()
		}
		dispatch({ type: GLOBALTYPES.STATUS, payload: false })
	}
	useEffect(() => {
		if (status.onEdit) {
			setContent(status.content)
			setImgs(status.imgs)
		}
	}, [status])

	return (
		<div className='status-modal' onSubmit={handleSubmit}>
			<form >
				<div className="status-header">
					<h5 className='m-0'>Create Post</h5>
					<span onClick={() => dispatch({ type: GLOBALTYPES.STATUS, payload: false })}>&times;</span>
				</div>
				<div className="status-body">
					<textarea name="content" value={content} placeholder={`${auth.user.userName}, What's on your mind?`} onChange={e => setContent(e.target.value)} style={{filter: theme ? 'invert(1)' : 'invert(0)',background: theme?'black':'white',color:theme?'white':'black'}}/>
					<div className="d-flex">
						<div className="flex-fill">
						</div>
							<Icons setContent={setContent} content={content} theme={theme}/>
					</div>
					<div className="show-imgs">
						{
							imgs.map((img, i) => (
								<div id="file-img" key={i}>
									{
										img.camera ? imgShow(img.camera,theme) : img.url ? <>
											{
												img.url.match(/video/i) ? videoShow(img.url,theme) : imgShow(img.url,theme)
											}
										</> : <>
											{
												img.type.match(/video/i) ? videoShow(URL.createObjectURL(img),theme) : imgShow(URL.createObjectURL(img),theme)
											}
										</>
									}
									<span style={{ filter: theme ? 'invert(1)' : 'invert(0)'}} onClick={() => deleteImgs(i)}>&times;</span>
								</div>
							))
						}
					</div>
					{
						stream &&
						<div className="stream position-relative">
							<video height='100%' width='100%' autoPlay muted style={{ filter: theme ? 'invert(1)' : 'invert(0)' }} ref={videoRef} />
							<span style={{ filter: theme ? 'invert(1)' : 'invert(0)'}} onClick={handleStopStream}>&times;</span>
							<canvas ref={refCanvas} style={{ display: 'none' }} />
						</div>
					}
					<div className="input-imgs">
						{
							stream
								? <i className='material-icons' onClick={handleCapture}>photo_camera</i>
								: <>
									<i className='material-icons' onClick={handleStream}>photo_camera</i>
									<div className="file-upload">
										<i className='material-icons'>image</i>
										<input type="file" name="file" id="file" multiple accept='image/*,video/*' onChange={handleChangeImg} />
									</div>
								</>
						}
					</div>
				</div>
				<div className="status-footer">
					<button className='btn btn-danger w-100' type='submit' style={{ filter: theme ? 'invert(1)' : 'invert(0)' }}>Post</button>
				</div>
			</form>
		</div>
	)
}

export default StatusModal
