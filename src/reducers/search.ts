import { handleActions, Action } from 'redux-actions'
import { ISearchPayload } from '../interfaces'

const initialState = {
  query: '',
  playlist: {
    playlists: [],
    more: true,
    offset: 0,
    isLoading: false
  }
}

function deepMerge (state: any, key: string, mergedObj: {}) {
  return Object.assign({}, state, { [key]: Object.assign({}, state[key] , mergedObj) })
}

export default handleActions({
  'search/query' (state: any, { payload = { query : ''} }: Action<ISearchPayload>) {
    return Object.assign({}, initialState, { query: payload.query })
  },
  'search/playlist/start' (state: any) {
    return deepMerge(state, 'playlist', { isLoading : true})
  },
  'search/playlist/end' (state: any) {
    return deepMerge(state, 'playlist', { isLoading : false})
  },
  'search/playlist/save' (state, { payload, meta }) {
    return deepMerge(state, 'playlist', {
      playlists: payload,
      offset: meta.offset,
      more: meta.more
    })
  }
}, initialState)
