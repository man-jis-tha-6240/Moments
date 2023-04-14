
import { Route, Navigate} from 'react-router-dom'

export const PrivateRouter = (props) => {
    const firstLogin = localStorage.getItem('firstLogin')
    return firstLogin ? <Route {...props} /> : <Navigate to="/" />
}




