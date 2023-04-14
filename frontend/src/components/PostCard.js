import React from 'react'
import Comments from './home/Comments'
import InputCmnt from './home/InputCmnt'
import CardBody from './home/postCards/CardBody'
import CardFooter from './home/postCards/CardFooter'
import CardHeader from './home/postCards/CardHeader'
const PostCard = ({ post,theme }) => {
	return (
		<div className="card my-3" key={post._id}>
			<CardHeader post={post} />
			<CardBody post={post} theme={theme}/>
			<CardFooter post={post} />
			<Comments post={post} />
			<InputCmnt post={post} />
		</div>
	)
}

export default PostCard
