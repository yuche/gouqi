import { handleActions, Action } from 'redux-actions'
import { ISearchPayload, ISearchState } from '../interfaces'

const initialState: ISearchState = {
  query: '',
  activeTab: 0,
  playlist: {
    playlists: [],
    more: true,
    offset: 0,
    isLoading: false,
    query: ''
  },
  song: {
    songs: [],
    more: true,
    offset: 0,
    isLoading: false,
    query: ''
  }
}


function deepperMerge (state: any, key: string, mergedObj: {}) {
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
    return deepperMerge(state, 'playlist', { isLoading : true })
  },
  'search/playlist/end' (state: any) {
    return deepperMerge(state, 'playlist', { isLoading : false })
  },
  'search/playlist/save' (state, { payload, meta }) {
    return deepperMerge(state, 'playlist', {
      playlists: payload,
      offset: meta.offset,
      more: meta.more
    })
  },
  // TODO:
  // 这个 reducer 实际上是 cache prev state
  // 避免 query 没有改变的时候重复请求
  // 看看以后有没有办法用 middleware 一起处理这类情况，下同
  'search/playlist/query' (state: any) {
    return deepperMerge(state, 'playlist', { query : state.query })
  },
  'search/song/start' (state: any) {
    return deepperMerge(state, 'song', { isLoading : true})
  },
  'search/song/end' (state: any) {
    return deepperMerge(state, 'song', { isLoading : false})
  },
  'search/song/save' (state, { payload, meta }) {
    return deepperMerge(state, 'song', {
      songs: payload,
      offset: meta.offset,
      more: meta.more
    })
  },
  'search/song/query' (state: any) {
    return deepperMerge(state, 'song', { query : state.query })
  }
}, initialState)
