import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { follow, unfollow } from '../redux/actions/profileAction';
const FollowBtn = ({ user }) => {
  const [followed, setFollowed] = useState(false);
  const [load, setLoad] = useState(false);
  const dispatch = useDispatch();
  const { auth, profile, theme, socket } = useSelector(state => state)
  useEffect(() => {
    if (auth.user.following.find(item => item._id === user._id)) {
      setFollowed(true)
    }
    return ()=>setFollowed(false)
  }, [auth.user.following, user._id])
  const handleFollow = async () => {
    if (load) {
      return;
    }
    setFollowed(true);
    setLoad(true)
    await dispatch(follow({ users: profile.users, user, auth, socket }))
    setLoad(false)
    console.log(followed);
  }
  const handleUnfollow = async () => {
    if (load) {
      return;
    }
    setFollowed(false);
    setLoad(true)
    await dispatch(unfollow({ users: profile.users, user, auth, socket }))
    setLoad(false)
    console.log(followed);
  }
  return (
    <>
      {
        followed ?
          <button className='btn btn-outline-danger' style={{ filter: theme ? 'invert(1)' : 'invert(0)' }} onClick={handleUnfollow}>Unfollow</button> :
          <button className='btn btn-outline-danger' style={{ filter: theme ? 'invert(1)' : 'invert(0)' }} onClick={handleFollow}>Follow</button>
      }
    </>
  )
}

export default FollowBtn
