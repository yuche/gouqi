import { handleActions } from 'redux-actions'

export const initialState = {
  albums: [],
  more: true,
  isLoading: false,
  isRefreshing: false,
  offset: 0
}

export default handleActions({
  'albums/refresh/start' (state) {
    return {
      ...state,
      isRefreshing: true
    }
  },
  'albums/refresh/end' (state) {
    return {
      ...state,
      isRefreshing: false
    }
  },
  'albums/sync/start' (state) {
    return {
      ...state,
      isLoading: true
    }
  },
  'albums/sync/end' (state) {
    return {
      ...state,
      isLoading: false
    }
  },
  'albums/sync/save' (state, { payload, meta = { more: true, offset: 0 } }: any) {
    return {
      ...state,
      albums: payload,
      more: meta.more,
      offset: meta.offset
    }
  }
}, initialState)
