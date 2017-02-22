import { take, put, fork, select, call } from 'redux-saga/effects'
import {
  toastAction
} from '../actions'
import * as api from '../services/api'
import { isEmpty } from 'lodash'
import {
  InteractionManager
} from 'react-native'
import {
  syncMoreResource
} from './common'

function* syncPlaylists () {
  while (true) {
    yield *syncMoreResource(
      'playlists/sync',
      'playlists',
      api.topPlayList,
      (state: any) => state.playlist,
      (result: any) => result.playlists
    )
  }
}

function* syncPlaylistDetail () {
  while (true) {
    const { payload }: { payload: number } = yield take('details/playlist')

    const playlist: api.IPlaylist = yield select((state: any) => state.details.playlist[payload])

    const isCached = !isEmpty(playlist)

    if ( !isCached ) {
      yield put({
        type: 'details/playlist/start'
      })
    }

    try {
      const response = yield call(api.playListDetail, payload.toString())

      yield call(InteractionManager.runAfterInteractions)

      if (response.code === 200) {
        const { result }: { result: api.IPlaylist } = response
        yield put({
          type: 'details/playlist/save',
          payload: {
            [payload]: result
          }
        })
      }
    } catch (error) {
      yield put(toastAction('error', '网络出现错误...'))
    } finally {
      yield put({
        type: 'details/playlist/end'
      })
    }

  }
}

function* subscribePlaylist () {
  while (true) {
    const { payload }: { payload: number } = yield take('details/playlist/subscribe')

    const playlist: api.IPlaylist = yield select((state: any) => state.details.playlist[payload])

    const { subscribed, subscribedCount } = playlist

    yield put({
      type: 'details/subscribe/start'
    })

    try {
      const response = yield call(api.subscribePlaylist, payload.toString(), !subscribed)
      if (response.code === 200) {
        const count = subscribed ? subscribedCount - 1 : subscribedCount + 1
        yield put({
          type: 'details/playlist/save',
          payload: {
            [payload]: {
              ...playlist,
              subscribedCount: count,
              subscribed: !subscribed
            }
          }
        })
      }
    } catch (error) {
      yield put(toastAction('error', '网络出现错误...'))
    }

    yield put({
      type: 'details/subscribe/end'
    })
  }
}

function* popupTrackActionSheet () {
  while (true) {
    const { payload }: { payload: api.ITrack } = yield take('playlists/track/popup')

    yield put({
      type: 'ui/popup/track/show'
    })

    yield put({
      type: 'playlists/track/save',
      payload
    })
  }
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

function* popupCollectActionSheet () {
  while (true) {
    yield take('playlists/collect/popup')

    yield put({
      type: 'ui/popup/track/hide'
    })

    yield call(InteractionManager.runAfterInteractions)

    yield put({
      type: 'ui/popup/collect/show'
    })

  }
}

export default function* rootSaga () {
  yield fork(syncPlaylists)
  yield fork(syncPlaylistDetail)
  yield fork(subscribePlaylist)
  yield fork(popupTrackActionSheet)
  yield fork(popupCollectActionSheet)
}
