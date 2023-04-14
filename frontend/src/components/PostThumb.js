import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import cutesad from '../imgs/cute-sad.gif'
const PostThumb = ({ posts, result }) => {
	const { theme } = useSelector(state => state)
	if (result === 0) {
		return (
			<>
				<img src={cutesad} alt="" className='d-block mx-auto' style={{ height: '85px', width: '85px', filter: theme ? 'invert(1)' : 'invert(0)' }} />
				<h3 className='text-center'>No posts</h3>
			</>)
	}
	return (
		<div className='post-thumb'>
			{
				posts.map((post) => (
					<Link key={post._id} to={`/post/${post._id}`}>
						<div className='post-thumb-display'>
							{
								post.imgs[0].url.match(/video/i)
									? <video controls src={post.imgs[0].url} alt={post.imgs[0].url} style={{ filter: theme ? 'invert(1)' : 'invert(0)' }} />

									: <img src={post.imgs[0].url} alt={post.imgs[0].url} style={{ filter: theme ? 'invert(1)' : 'invert(0)' }} />

							}
							<div className="post-thumb-menu">
								<i className="far fa-heart">{post.likes.length}</i>
								<i className="far fa-comment">{post.comments.length}</i>
							</div>
						</div>
					</Link>
				))
			}
		</div>
	)
}

export default PostThumb
