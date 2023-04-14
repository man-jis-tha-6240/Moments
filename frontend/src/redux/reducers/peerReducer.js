import { GLOBALTYPES } from "../actions/globalTypes"
const initialState=false
const peerReducer=(state=initialState,action)=>{
	switch (action.type) {
		case GLOBALTYPES.PEER:
			return action.payload	
		default:
			return state
	}
}
export default peerReducer