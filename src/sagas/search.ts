import { take, put, fork, select, takeEvery, all } from 'redux-saga/effects'
import { searchSelector, syncSearchResource } from './common'
import * as api from '../services/api'

const searchPageOrder = ['song', 'playlist', 'artist', 'album']

export function* requestSearch () {
  const prevState = yield select(searchSelector)

  const key = searchPageOrder[prevState.activeTab]

  yield put({
    type: `search/${key}/query`
  })

  const { [key]: { query } } = yield select(searchSelector)

  if (query && query !== prevState[key].query) {
    yield put({
      type: `search/${key}`
    })
  }
}

export const syncSearchSongs = syncSearchResource(
  api.SearchType.song,
  'song'
)

export const syncSearchPlaylists = syncSearchResource(
  api.SearchType.playList,
  'playlist'
)

export const syncSearchArtist = syncSearchResource(
  api.SearchType.artist,
  'artist'
)

export const syncSearchAlbums = syncSearchResource(
  api.SearchType.album,
  'album'
)

export default function* rootSaga () {
  yield all([
    takeEvery('search/query', requestSearch),
    takeEvery('search/activeTab', requestSearch),
    fork(syncSearchSongs),
    fork(syncSearchPlaylists),
    fork(syncSearchArtist),
    fork(syncSearchAlbums)
  ])
}
