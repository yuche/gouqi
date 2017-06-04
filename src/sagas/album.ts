import { put, select, call, takeLatest, takeEvery, all } from 'redux-saga/effects'
import * as api from '../services/api'
import {
  InteractionManager
} from 'react-native'
import {
  refreshResource,
  syncMoreResource
} from './common'

export const refreshAlbums = refreshResource(
  'albums',
  api.newAlbums
)

export const syncMoreAlbums = syncMoreResource(
  'albums',
  'album',
  api.newAlbums
)

export const albumSelector = (state) => state.details.albums

export function* syncAlbum ( { payload }: any ) {
  yield call(InteractionManager.runAfterInteractions)
  const albums: api.IAlbum = yield select(albumSelector)
  const album = albums[payload]

  if (!album) {
    yield put({
      type: 'details/playlist/start'
    })
  }

  const [song, detail] = yield call(Promise.all, [
    api.albumInfo(payload.toString()),
    api.albumDetail(payload.toString())
  ])

  if (song.code === 200 && detail.code === 200) {
    yield put({
      type: 'details/album/save',
      payload: {
        [payload]: {
          ...song.album,
          description: detail.album.description
        }
      }
    })
  }

  yield put({
    type: 'details/playlist/end'
  })
}

export default function* watchAlbums () {
  yield all([
    takeLatest('albums/refresh', refreshAlbums),
    takeLatest('albums/sync', syncMoreAlbums),
    takeEvery('albums/detail', syncAlbum)
  ])
}
