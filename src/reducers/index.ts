import { combineReducers } from 'redux'
import login from './user'
import playlist from './playlist'
import ui from './ui'

export default combineReducers({
  login,
  playlist,
  ui
})
