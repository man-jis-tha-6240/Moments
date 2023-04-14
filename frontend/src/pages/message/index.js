import React from 'react'
import { useSelector } from 'react-redux'
import LeftSide from '../../components/message/LeftSide'
const Message = () => {
	const { theme } = useSelector(state => state)
	return (
		<div className='message d-flex'>
			<div className="col-md-4 border-end px-0 left-of-msg">
				<LeftSide />
			</div>
			<div className="col-md-4 px-0 mess-right">
				<div className="d-flex justify-content-center align-items-center flex-column h-100 w-100">
					<i className='fab fa-facebook-messenger' style={{ fontSize: '5rem', color: 'rgb(228, 162, 175)', filter: theme ? 'invert(1)' : 'invert(0)' }} />
					<h4>Messenger</h4>
				</div>
			</div>
		</div>
	)
}

export default Message
