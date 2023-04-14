export const imgShow = (src,theme) => {
	return (
		<img src={src} alt="imgs" style={{ filter: theme ? 'invert(1)' : 'invert(0)' }} className='img-thumbnail' />
	)
}
export const videoShow = (src,theme) => {
	return (
		<video controls src={src} alt="video" style={{ filter: theme ? 'invert(1)' : 'invert(0)'}} className='img-fluid' />
	)
}