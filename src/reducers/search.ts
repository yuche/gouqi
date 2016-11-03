import { handleActions, Action } from 'redux-actions'
import { ISearchPayload, ISearchState } from '../interfaces'

const initialState: ISearchState = {
  query: '',
  activeTab: 0,
  playlist: {
    playlists: [],
    more: true,
    offset: 0,
    isLoading: false
  },
  song: {
    songs: [],
    more: true,
    offset: 0,
    isLoading: false
  }
}


function deepMerge (state: any, key: string, mergedObj: {}) {
  return Object.assign({}, state, { [key]: Object.assign({}, state[key] , mergedObj) })
}

export default handleActions({
  'search/activeTab' (state, { payload }) {
    return Object.assign({}, state, { activeTab: payload })
  },
  'search/query' (state: any, { payload = { query : ''} }: Action<ISearchPayload>) {
    return Object.assign({}, Object.assign({}, initialState, { activeTab: state.activeTab }), { query: payload.query })
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
  },
  'search/song/start' (state: any) {
    return deepMerge(state, 'song', { isLoading : true})
  },
  'search/song/end' (state: any) {
    return deepMerge(state, 'song', { isLoading : false})
  },
  'search/song/save' (state, { payload, meta }) {
    return deepMerge(state, 'song', {
      songs: payload,
      offset: meta.offset,
      more: meta.more
    })
  }
}, initialState)
