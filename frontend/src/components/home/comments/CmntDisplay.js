import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import CmntCard from './CmntCard'

const CmntDisplay = ({ comment, post, replyCm }) => {
	const {theme}=useSelector(state=>state)
	const [showRep, setShowRep] = useState([])
	const [next, setNext] = useState(1)
	useEffect(() => {
		setShowRep(replyCm.slice(replyCm.length - next))
	}, [replyCm, next])
	return (
		<div className='cmnt-display'>
			<CmntCard comment={comment} post={post} cmntId={comment._id}>
				<div className='ps-4'>
					{
						showRep.map((item, index) => (
							item.reply &&
							<CmntCard key={index} comment={item} post={post} cmntId={comment._id} />
						))
					}
					{
						replyCm.length - next > 0
							? <div  style={{ cursor: 'pointer', color: 'crimson' ,filter: theme ? 'invert(1)' : 'invert(0)' }}
								onClick={() => setNext(next + 10)}>
								See more comments...
							</div>

							: replyCm.length > 1 &&
							<div style={{ cursor: 'pointer', color: 'crimson' }}
								onClick={() => setNext(1)}>
								Hide comments...
							</div>
					}
				</div>
			</CmntCard>
		</div>
	)
}

export default CmntDisplay
