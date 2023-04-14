import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Loading from './Loading';
import Toast from './Toast';
const Alert = () => {
	const dispatch = useDispatch();
	const { alert } = useSelector(state => state);
	return (
		<div>
			{alert.loading && <Loading />}

			{alert.err && <Toast msg={{ title: 'Error!', body: alert.err }} handleShow={() => dispatch({ type: 'ALERT', payload: {} })} bgColor='bg-danger' />}

			{alert.success && <Toast msg={{ title: 'Success!!', body: alert.success }} handleShow={() => dispatch({ type: 'ALERT', payload: {} })} bgColor='bg-success' />}

		</div>
	)
}

export default Alert
