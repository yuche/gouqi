import { take, put, fork, select, call } from 'redux-saga/effects'
import { takeLatest, delay } from 'redux-saga'
import * as api from '../services/api'
import {
  InteractionManager
} from 'react-native'
import {
  ajaxCall,
  refreshResource,
  syncMoreResource
} from './common'

const refreshArtists = refreshResource(
  'artists',
  api.topArtists,
  100
)

const syncMoreArtists = syncMoreResource(
  'artists',
  'artist',
  api.topArtists,
  100
)

function* syncArtistTracks () {
  while (true) {
    const { payload } = yield take('artists/detail/track')

    yield delay(100) // delay 100ms for scrollable tab view layout

    yield put({
      type: 'artists/detail/track/start'
    })

    const response = yield* ajaxCall(api.artistInfo, payload.toString())

    yield call(InteractionManager.runAfterInteractions)

    if (response.code === 200) {
      yield put({
        type: 'artists/detail/track/save',
        payload: {
          tracks: response.hotSongs,
          artist: response.artist
        },
        meta: payload
      })
    }

    yield put({
      type: 'artists/detail/track/end'
    })
  }
}

function* syncArtistAlbums () {
  while (true) {
    const { payload } = yield take('artists/detail/album')

    yield put({
      type: 'artists/detail/album/start'
    })

    const response = yield* ajaxCall(api.getAlbumsByArtistId, payload.toString(), '50')

    yield call(InteractionManager.runAfterInteractions)

    if (response.code === 200) {
      yield put({
        type: 'artists/detail/album/save',
        payload: response.hotAlbums,
        meta: payload
      })
    }

    yield put({
      type: 'artists/detail/album/end'
    })
  }
}

function* syncArtistDescription () {
  while (true) {
    const { payload } = yield take('artists/detail/description')

    yield put({
      type: 'artists/detail/description/start'
    })

    const response = yield* ajaxCall(api.artistDescription, payload.toString())

    yield call(InteractionManager.runAfterInteractions)

    if (response.code === 200) {
      yield put({
        type: 'artists/detail/description/save',
        payload: {
          brief: response.briefDesc,
          introduction: response.introduction
        },
        meta: payload
      })
    }

    yield put({
      type: 'artists/detail/description/end'
    })
  }
}

function* toggleSubscribeArtist ({ payload }) {
  const id = payload.toString()
  let { followed } = yield select((state: any) => state.artist.detail[payload].artist)
  yield put({
    type: 'artists/detail/follow/start'
  })

  const response = followed
    ? yield call(api.unsubscribeArtist, id)
    : yield call(api.subscribeArtist, id)

  if (response.code === 200) {
    yield put({
      type: 'artists/detail/follow/toggle',
      payload: !followed,
      meta: Number(id)
    })
  }

  yield put({
    type: 'artists/detail/follow/end'
  })
}

function* favorites () {
  yield put({
    type: 'artists/favo/start'
  })

  const response = yield call(api.favoriteArtists)

  if (response.code) {
    yield put({
      type: 'artists/favo/save',
      payload: response.data
    })
  }

  yield put({
    type: 'artists/favo/end'
  })
}

export default function* watchArtists() {
  yield [
    takeLatest('artists/refresh', refreshArtists),
    takeLatest('artists/sync', syncMoreArtists),
    takeLatest('artists/detail/follow', toggleSubscribeArtist),
    takeLatest('artists/favo', favorites),
    fork(syncArtistTracks),
    fork(syncArtistAlbums),
    fork(syncArtistDescription)
  ]
}
