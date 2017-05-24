import { handleActions } from 'redux-actions'

export const initialState = {
  playlist: {
    created: [],
    collect: []
  },
  profile: {},
  daily: [],
  isLoading: false
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
  },
  'personal/daily/start' (state) {
    return {
      ...state,
      isLoading: true
    }
  },
  'personal/daily/end' (state) {
    return {
      ...state,
      isLoading: false
    }
  },
  'personal/daily/save' (state, { payload }: any) {
    return {
      ...state,
      daily: payload
    }
  }
}, initialState)
