import { put, select } from 'redux-saga/effects'
import * as api from '../services/api'
import {
  toastAction
} from '../actions'
import { takeLatest } from 'redux-saga'
import { ajaxCall } from './common'
import { sampleSize } from 'lodash'
import { changeCoverImgUrl } from '../utils'

function* recommendSaga () {
  const isLogin = !!api.getUserId()
  const promises = [
    api.topPlayList('30'),
    api.newAlbums('30'),
    api.topArtists('30')
  ]
  if (isLogin) {
    promises.push(api.dailyRecommend('30'))
  }

  yield put({
    type: 'home/recommend/start'
  })

  try {
    const [
      playlists,
      albums,
      artists,
      songs
    ] =  yield Promise.all(promises)

    if (playlists.code === 200) {
      yield put({
        type: 'playlists/sync/save',
        payload: changeCoverImgUrl(playlists.playlists),
        meta: {
          more: true,
          offset: 0
        }
      })
    }

    if (albums.code === 200 && artists.code === 200) {
      yield put({
        type: 'home/recommend/save',
        payload: {
          albums: sampleSize(albums.albums, 6),
          artists: sampleSize(artists.artists, 6)
        }
      })
    }

    if (songs.code === 200) {
      yield put({
        type: 'personal/daily/save',
        payload: songs.recommend.slice(0, 6)
      })
    }
  } catch (error) {
    yield put(toastAction('error', '网络出现错误..'))
  }

  yield put({
    type: 'home/recommend/end'
  })
}

function* syncMoreAlbums () {
  const albumsOffset = yield select((state: any) => state.home.albumsOffset)

  yield put({
    type: 'home/recommend/start'
  })

  const offset = albumsOffset + 30

  const response = yield* ajaxCall(api.newAlbums, 30, offset.toString())

  if (response.code === 200) {
    if (response.total > offset) {
      yield put({
        type: 'home/albums/save',
        payload: response.albums,
        meta: offset
      })
    } else {
      yield put(toastAction('info', '所有内容已经加载完毕。'))
    }
  }

  yield put({
    type: 'home/recommend/end'
  })
}

function* syncMoreArtists () {
  const artistsOffset = yield select((state: any) => state.home.artistsOffset)

  yield put({
    type: 'home/recommend/start'
  })

  const offset = artistsOffset + 30

  const response = yield* ajaxCall(api.topArtists, 30, offset.toString())

  if (response.code === 200) {
    if (response.more) {
      yield put({
        type: 'home/artists/save',
        payload: response.albums,
        meta: offset
      })
    } else {
      yield put(toastAction('info', '所有内容已经加载完毕。'))
    }
  }

  yield put({
    type: 'home/recommend/end'
  })
}

export default function* watchRecommend () {
  yield [
    takeLatest('home/recommend', recommendSaga),
    takeLatest('home/albums', syncMoreAlbums),
    takeLatest('home/artists', syncMoreArtists)
  ]
}
