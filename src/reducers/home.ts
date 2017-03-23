import { handleActions } from 'redux-actions'

const initialState = {
  artists: [],
  albums: [],
  isLoading: false
}

export default handleActions({
  'home/recommend/start' (state) {
    return {
      ...state,
      isLoading: true
    }
  },
  'home/recommend/save' (state, { payload: { albums, artists } }: any) {
    return {
      ...state,
      albums,
      artists
    }
  },
  'home/recommend/end' (state) {
    return {
      ...state,
      isLoading: false
    }
  }
}, initialState)
