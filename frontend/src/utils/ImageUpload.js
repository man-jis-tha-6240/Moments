export const checkImage = (file) => {
	let err = '';
	if (!file) {
		return err = 'No file chosen'
	}
	if (file.size > 1024 * 1024) {
		err = 'File size shoud be within 1 mb'
	}
	if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
		err = 'File type must be jpeg or png'
	}
	return err;
}
export const checkImg = (file) => {
	let err = '';
	if (!file) {
		return err = 'No file chosen'
	}
	if (file.size > 1024 * 1024 * 5) {
		err = 'File size shoud be within 5 mb'
	}
	return err;
}
export const imageUpload = async (images) => {
	let imgArr = [];
	for (const item of images) {
		const formData = new FormData();
		if (item.camera) {
			formData.append('file', item.camera)
		}
		else {
			formData.append('file', item)
		}
		formData.append('upload_preset', 'bg6xbzrf')
		formData.append('cloud_name', 'db1hy1n9p')
		const res = await fetch('https://api.cloudinary.com/v1_1/db1hy1n9p/upload', { method: 'POST', body: formData })
		const data = await res.json()
		imgArr.push({ public_id: data.public_id, url: data.secure_url })
	}
	return imgArr;
}