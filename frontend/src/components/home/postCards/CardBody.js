import React, { useState } from 'react'
import Caraousel from '../../Caraousel'
const CardBody = ({ post,theme }) => {
	const [reaaMore, setReadMore] = useState(false)
	return (
		<div className='card-body'>
			<div className="card-body-content" style={{filter: theme ? 'invert(1)' : 'invert(0)',color: theme?'white':'black'}}>
				<span>
					{
						post.content.length < 60
							? post.content
							: reaaMore ? post.content + '' : post.content.slice(0, 60) + '...'

					}
				</span>
				{
					post.content.length > 60 &&
					<span className='readMore' onClick={()=>setReadMore(!reaaMore)} style={{ filter: theme ? 'invert(1)' : 'invert(0)' }}>
						{reaaMore ? ' Hide' : 'Read more'}
					</span>
				}
			</div>
			{
				post.imgs.length > 0 && <Caraousel imgs={post.imgs} id={post._id} />
			}
		</div>
	)
}

export default CardBody
