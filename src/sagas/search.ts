import { take, put, fork, select } from 'redux-saga/effects'
import { syncSearchResource } from './common'
import * as api from '../services/api'

const searchPageOrder = ['song', 'playlist', 'artist', 'album']

function* requestSearch () {
  const prevState = yield select((state: any) => state.search)

  const key = searchPageOrder[prevState.activeTab]

  yield put({
    type: `search/${key}/query`
  })

  const { [key]: { query } }  = yield select((state: any) => state.search)

  if (query && query !== prevState[key].query) {
    yield put({
      type: `search/${searchPageOrder[prevState.activeTab]}`
    })
  }
}

function* searchQuerying () {
  while (true) {
    yield take('search/query')

    yield *requestSearch()
  }
}

function* changeSearchActiveTab () {
  while (true) {
    yield take('search/activeTab')

    yield *requestSearch()
  }
}

function* syncSearchSongs () {
  while (true) {
    yield *syncSearchResource(
      api.SearchType.song,
      'song',
      '',
    )
  }
}

function* syncSearchPlaylists () {
  while (true) {
    yield *syncSearchResource(
      api.SearchType.playList,
      'playlist',
      'coverImgUrl'
    )
  }
}

function* syncSearchArtist () {
  while (true) {
    yield *syncSearchResource(
      api.SearchType.artist,
      'artist',
      'img1v1Url'
    )
  }
}

function* syncSearchAlbums () {
  while (true) {
    yield *syncSearchResource(
      api.SearchType.album,
      'album',
      'picUrl'
    )
  }
}

export default function* rootSaga () {
  yield fork(searchQuerying)
  yield fork(changeSearchActiveTab)
  yield fork(syncSearchSongs)
  yield fork(syncSearchPlaylists)
  yield fork(syncSearchArtist)
  yield fork(syncSearchAlbums)
}
