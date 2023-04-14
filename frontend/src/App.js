import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Alert from "./components/alert/Alert";
import Peer from 'peerjs'
import PageRender from "./customRouter/PageRender";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from "react";
import { refreshToken } from "./redux/actions/authAction";
import Navbar from "./components/Navbar/Navbar";
import { PrivateRouter } from "./customRouter/PrivateRouter";
import StatusModal from "./components/StatusModal";
import { getPost } from "./redux/actions/postAction";
import { getSuggestions } from "./redux/actions/suggestionAction";
import io from 'socket.io-client'
import { GLOBALTYPES } from "./redux/actions/globalTypes";
import SocketClient from "./SocketClient";
import { getNotifies } from "./redux/actions/notifyAction";
import CallModal from "./components/message/CallModal";

function App() {
  const { auth, status, modal, call } = useSelector(state => state);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(refreshToken());
    const socket = io()
    dispatch({ type: GLOBALTYPES.SOCKET, payload: socket })
    return () => socket.close();
  }, [dispatch])
  useEffect(() => {
    if (auth.token) {
      dispatch(getPost(auth.token))
      dispatch(getSuggestions(auth.token))
      dispatch(getNotifies(auth.token))
    }
  }, [dispatch, auth.token])
  useEffect(() => {
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
    } else if (Notification.permission === "granted") {
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
        }
      });
    }
  }, [])
  useEffect(() => {
    const newPeer = new Peer(undefined, {
      path: '/', secure: true
    })
    dispatch({ type: GLOBALTYPES.PEER, payload: newPeer })
  }, [dispatch])
  return (
    <Router>
      <Alert />
      <input type="checkbox" id="theme" style={{ display: 'none' }} />
      <div className={`App ${(status || modal) && 'mode'}`}>
        <div className="main" >
          {auth.token && <Navbar />}
          {status && <StatusModal />}
          {auth.token && <SocketClient />}
          {call && <CallModal />}
          <Routes>
            <Route exact path='/' element={auth.token ? <Home /> : <Login />} />
            <Route exact path="/signup" element={<Signup />} />
            {auth.token && <Route element={<PrivateRouter />} />}
            <Route exact path="/:page" element={<PageRender />} />
            <Route exact path="/:page/:id" element={<PageRender />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
