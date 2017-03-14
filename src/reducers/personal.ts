import { handleActions } from 'redux-actions'

const initialState = {
  playlist: {
    created: [],
    collect: []
  },
  profile: {}
}
export default handleActions({
  'personal/playlist/save' (state, { payload }) {
    return {
      ...state,
      playlist: {
        ...state.playlist,
        ...payload
      }
    }
  },
  'personal/profile' (state, { payload }) {
    return {
      ...state,
      profile: payload
    }
  }
}, initialState)
