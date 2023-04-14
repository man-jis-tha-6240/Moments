import React from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Notfound from '../components/Notfound'
const generatePg = (pgName) => {
	const component = () => require(`../pages/${pgName}`).default
	try {
		return React.createElement(component())
	} catch (error) {
		return <Notfound />
	}
}
const PageRender = () => {
	const { page, id } = useParams();
	const {auth}=useSelector(state=>state)
	let pgName = '';
	if (auth.token) {if (id) {
		pgName = `${page}/[id]`;
		
	}
	else {
		pgName = `${page}`;
	}}
	return generatePg(pgName)
	
}

export default PageRender
