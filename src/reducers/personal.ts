import { handleActions } from 'redux-actions'

const initialState = {
  playlist: {
    created: [],
    collect: []
  }
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
  }
}, initialState)
