import { combineReducers } from 'redux'
import login from './user'
import playlist from './playlist'
import ui from './ui'
import search from './search'
import details from './detail'
import comment from './comment'
import personal from './personal'
import player from './player'

export default combineReducers({
  login,
  playlist,
  ui,
  search,
  details,
  comment,
  personal,
  player
})
