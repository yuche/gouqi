import { handleActions } from 'redux-actions'

const initialState = {
  artists: [],
  more: true,
  isLoading: false,
  isRefreshing: false,
  offset: 0
}

export default handleActions({
  'artists/refresh/start' (state) {
    return {
      ...state,
      isRefreshing: true
    }
  },
  'artists/refresh/end' (state) {
    return {
      ...state,
      isRefreshing: false
    }
  },
  'artists/sync/start' (state) {
    return {
      ...state,
      isLoading: true
    }
  },
  'artists/sync/end' (state) {
    return {
      ...state,
      isLoading: false
    }
  },
  'artists/sync/save' (state, { payload, meta = { more: true, offset: 0 } }: any) {
    return {
      ...state,
      artists: payload,
      more: meta.more,
      offset: meta.offset
    }
  }
}, initialState)
