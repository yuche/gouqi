import { handleActions } from 'redux-actions'

const initialState = {
  comments: {},
  isLoading: false
}
export default handleActions({
  'comments/sync/start' (state) {
    return {
      ...state,
      isLoading: true
    }
  },
  'comments/sync/end' (state) {
    return {
      ...state,
      isLoading: false
    }
  },
  'comments/sync/save' (state, { payload }) {
    return {
      ...state,
      comments: {
        ...state.comments,
        ...payload
      }
    }
  },
}, initialState)
