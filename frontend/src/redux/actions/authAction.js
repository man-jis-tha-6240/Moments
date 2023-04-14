import { postDataAPI } from "../../utils/fetchData"
import { GLOBALTYPES } from "./globalTypes";
import { valid } from "../../utils/valid"
export const login = (data) => async (dispatch) => {
	try {
		dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });
		const res = await postDataAPI('login', data);
	
		dispatch({
			type: GLOBALTYPES.AUTH,
			payload: {
				token: res.data.access_token,
				user: res.data.user
			}
		})

		localStorage.setItem("firstLogin", true)
		dispatch({
			type: GLOBALTYPES.ALERT,
			payload: {
				success: res.data.msg
			}
		})

	} catch (error) {
		dispatch({ type: GLOBALTYPES.ALERT, payload: { err: error.response.data.msg } });
	}
}

export const refreshToken = () => async (dispatch) => {
	const firstLogin = localStorage.getItem("firstLogin")
	if(firstLogin){
        dispatch({ type: GLOBALTYPES.ALERT, payload: {loading: true} })
        try {
            const res = await postDataAPI('refresh_token');
            dispatch({ 
                type: GLOBALTYPES.AUTH, 
                payload: {
                    token: res.data.access_token,
                    user: res.data.user
                } 
            })

            dispatch({ type: GLOBALTYPES.ALERT, payload: {} })

        } catch (err) {
            dispatch({ 
                type: GLOBALTYPES.ALERT, 
                payload: {
                    error: err.response.data.msg
                } 
            })
        }
    }
}

export const signup = (data) => async (dispatch) => {
	try {
		const check = valid(data)
		if (check.errorLength > 0) {
			return dispatch({
				type: GLOBALTYPES.ALERT, payload: check.errorMsg,
			})
		}
		dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } })
		const res = await postDataAPI('register', data)
		dispatch({
			type: GLOBALTYPES.AUTH,
			payload: {
				token: res.data.access_token,
				user: res.data.user
			}
		})

		localStorage.setItem("firstLogin", true)
		dispatch({
			type: GLOBALTYPES.ALERT,
			payload: {
				success: res.data.msg
			}
		})
	} catch (error) {
		console.log(error);
		dispatch({ type: GLOBALTYPES.ALERT, payload: { err: error.response.data.msg } });
	}
}
export const logout = () => async(dispatch)=>{
	try {
		localStorage.removeItem('firstlogin')
		await postDataAPI('logout')
		window.location.href='/'
	} catch (error) {
		dispatch({ type: GLOBALTYPES.ALERT, payload: { err: error.response.data.msg } });
		
	}
}