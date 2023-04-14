import React from 'react'
import Post from '../components/home/Post'
import Status from '../components/home/Status'
import { useSelector } from 'react-redux'
import LoadIcon from '../imgs/loading.gif'
import RightSideBar from '../components/home/RightSideBar'
const Home = () => {
	const { homePosts, theme } = useSelector(state => state)
	return (
		<div className='home row mx-0'>
			<div className="col-md-8">
				<Status />
				{
					homePosts.loading
						? <img src={LoadIcon} alt="loading" className='d-block mx-auto' style={{ filter: theme ? 'invert(1)' : 'invert(0)' }} />
						: (homePosts.result === 0 && homePosts.posts.length === 0)
							? <h2 className="text-center">No Posts</h2>
							: <Post />
				}
			</div>
			<div className="col-md-4" >
				<RightSideBar />
			</div>
		</div>
	)
}

export default Home
