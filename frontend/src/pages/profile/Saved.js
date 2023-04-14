import React, { useState, useEffect } from 'react'
import LoadIcon from '../../imgs/loading.gif'
import { getDataAPI } from '../../utils/fetchData'
import { GLOBALTYPES } from '../../redux/actions/globalTypes'
import PostThumb from '../../components/PostThumb'
import LoadMoreBtn from '../../components/LoadMoreBtn'
const Saved = ({ auth, dispatch }) => {
	const [savePosts, setSavePosts] = useState([])
	const [result, setResult] = useState(9)
	const [page, setPage] = useState(2)
	const [load, setLoad] = useState(false)
	const handleLoadMore = async () => {
		setLoad(true)
		const res = await getDataAPI(`getSavedPosts?limit=${page * 9}`, auth.token)
		setSavePosts(res.data.savePosts)
		setResult(res.data.result)
		setPage(page +1)
		setLoad(false)
	}
	useEffect(() => {
		setLoad(true)
		getDataAPI('getSavedPosts', auth.token).then(res => {
			setSavePosts(res.data.savePosts)
			setResult(res.data.result)
			setLoad(false)
		}).catch(err => {
			dispatch({ type: GLOBALTYPES.ALERT, payload: { err: err.response.data.msg } });
		})
	}, [auth.token,dispatch])
	return (
		<div>
			<PostThumb posts={savePosts} result={result} />
			{
				load && <img src={LoadIcon} alt="loading" className='d-block mx-auto' />
			}

			<LoadMoreBtn result={result} page={page} load={load} handleLoadMore={handleLoadMore} />


		</div>
	)
}

export default Saved
