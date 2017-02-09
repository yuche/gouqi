import { combineReducers } from 'redux'
import login from './user'
import playlist from './playlist'
import ui from './ui'
import search from './search'
import details from './detail'

export default combineReducers({
  login,
  playlist,
  ui,
  search,
  details
})
