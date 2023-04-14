import React from 'react'
import LeftSide from '../../components/message/LeftSide'
import RightSide from '../../components/message/RightSide'
const Conversation = () => {
	return (
		<div className="message d-flex ">
			<div className="col-md-4 border-end px-0 mess-left">
				<LeftSide />
			</div>
			<div className="col-md-8 px-0 right-of-msg">
				<RightSide />
			</div>
		</div>
	)
}

export default Conversation
