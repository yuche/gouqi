import { combineReducers } from 'redux'
import login from './user'
import playlist from './playlist'

export default combineReducers({
  login,
  playlist
})
