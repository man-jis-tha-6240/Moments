import React from 'react'
import { useSelector } from 'react-redux'
const LoadMoreBtn = ({ result, page, load, handleLoadMore }) => {
	const { theme } = useSelector(state => state)
	return (
		<>
			{
				result < 9 * (page - 1) ? ''
					: !load &&
					<button className='btn btn-danger mx-auto d-block' onClick={handleLoadMore} style={{ filter: theme ? 'invert(1)' : 'invert(0)' }}>Load more</button>

			}
		</>
	)
}

export default LoadMoreBtn
