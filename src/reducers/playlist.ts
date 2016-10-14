import { handleActions } from 'redux-actions'
import { assign } from '../utils'

const initialState = {
  isLoading: false,
  playlists: [],
  offset: 0,
  more: true
}

export default handleActions({
  'playlists/sync/start' (state) {
    return assign(state, {
      isLoading: true
    })
  },

  'playlists/sync/end' (state) {
    return assign(state, {
      isLoading: false
    })
  },

  'playlists/sync/save' (state, action) {
    return assign(state, {
      playlists: action.payload
    })
  },

  'playlists/meta' (state, { meta }) {
    return assign(state, {
      offset: meta.offset,
      more: meta.more
    })
  }
}, initialState)
