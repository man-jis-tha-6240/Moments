import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { getSinglePost } from '../../redux/actions/postAction'
import LoadIcon from '../../imgs/loading.gif'
import PostCard from '../../components/PostCard'
const MyPost = () => {
	const { id } = useParams()
    const [post, setPost] = useState([])

    const { auth, detailPost } = useSelector(state => state)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getSinglePost({detailPost, id, auth}))

        if(detailPost.length > 0){
            const newArr = detailPost.filter(post => post._id === id)
            setPost(newArr)
        }
    },[detailPost, dispatch, id, auth])

	return (
		<div className='posts'>
			{
				post.length === 0 &&
				<img src={LoadIcon} alt="loading" className='d-block mx-auto my-4' />
			}
			{
				post.map(item => (
					<PostCard key={item._id} post={item} />
				))
			}
		</div>
	)
}

export default MyPost
