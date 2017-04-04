import { take, put, fork, select, call } from 'redux-saga/effects'
import { takeLatest } from 'redux-saga'
import * as api from '../services/api'
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

    yield put({
      type: 'artists/detail/track/start'
    })

    const response = yield* ajaxCall(api.artistInfo, payload.toString())

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

export default function* watchArtists() {
  yield [
    takeLatest('artists/refresh', refreshArtists),
    takeLatest('artists/sync', syncMoreArtists),
    fork(syncArtistTracks)
  ]
}
