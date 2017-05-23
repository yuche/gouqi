import { take, put, fork, select, call, takeLatest, all, takeEvery } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import * as api from '../services/api'
import {
  InteractionManager
} from 'react-native'
import {
  ajaxCall,
  refreshResource,
  syncMoreResource
} from './common'

export const refreshArtists = refreshResource(
  'artists',
  api.topArtists,
  100
)

export const syncMoreArtists = syncMoreResource(
  'artists',
  'artist',
  api.topArtists,
  100
)

export function* syncArtistTracks ({ payload }: any) {
  yield call(delay, 100) // delay 100ms for scrollable tab view layout

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

export function* syncArtistAlbums ({ payload }: any) {
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

export function* syncArtistDescription ({ payload }: any) {
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

export const detailSelector = (state) => state.artist.detail

export function* toggleSubscribeArtist ({ payload }: any) {
  const id = payload.toString()
  const detail = yield select(detailSelector)
  const { followed } = detail[id].artist
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

export function* favorites () {
  yield put({
    type: 'artists/favo/start'
  })

  const response = yield call(api.favoriteArtists)

  if (response.code === 200) {
    yield put({
      type: 'artists/favo/save',
      payload: response.data
    })
  }

  yield put({
    type: 'artists/favo/end'
  })
}

export default function* watchArtists () {
  yield all([
    takeLatest('artists/refresh', refreshArtists),
    takeLatest('artists/sync', syncMoreArtists),
    takeLatest('artists/detail/follow', toggleSubscribeArtist),
    takeLatest('artists/favo', favorites),
    takeEvery('artists/detail/track', syncArtistTracks),
    takeEvery('artists/detail/album', syncArtistAlbums),
    takeEvery('artists/detail/description', syncArtistDescription)
  ])
}
