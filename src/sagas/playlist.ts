import { take, put, fork, select, call, takeLatest, all } from 'redux-saga/effects'
import {
  toastAction,
  hideBatchOpsModal
} from '../actions'
import * as api from '../services/api'
import {
  InteractionManager
} from 'react-native'
import {
  ajaxCall,
  refreshResource,
  syncMoreResource
} from './common'
import Router from '../routers'

export const syncPlaylists = syncMoreResource(
  'playlists',
  'playlist',
  api.topPlayList
)

export const refreshPlaylist = refreshResource(
  'playlists',
  api.topPlayList
)

export const playlistSelector = (state) => state.details.playlist

export function* syncPlaylistDetail () {
  while (true /* istanbul ignore next  */) {
    const { payload }: { payload: number } = yield take('details/playlist')

    const { [payload]: playlist } = yield select(playlistSelector)

    if ( !playlist ) {
      yield put({
        type: 'details/playlist/start'
      })
    }

    const response = yield* ajaxCall(api.playListDetail, payload.toString())

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

    yield put({
      type: 'details/playlist/end'
    })

  }
}

export function* subscribePlaylist () {
  while (true /* istanbul ignore next  */) {
    const { payload }: { payload: number } = yield take('details/playlist/subscribe')

    const { [payload]: playlist } = yield select(playlistSelector)

    const { subscribed, subscribedCount } = playlist

    yield put({
      type: 'details/subscribe/start'
    })

    const response = yield* ajaxCall(api.subscribePlaylist, payload.toString(), !subscribed)

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

    yield put({
      type: 'details/subscribe/end'
    })
  }
}

export function* popupTrackActionSheet () {
  while (true /* istanbul ignore next  */) {
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

export function* popupCollectActionSheet () {
  while (true /* istanbul ignore next  */) {
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

export const batchOpsVisableSelector = (state: any) => state.ui.modal.playlist.visible

export function* collectTrackToPlayliast () {
  while (true /* istanbul ignore next  */) {
    const { payload } = yield take('playlists/collect')
    const batchOpsVisable = yield select(batchOpsVisableSelector)

    yield put({
      type: 'ui/popup/collect/hide'
    })

    if (batchOpsVisable) {
      yield call(InteractionManager.runAfterInteractions)
      yield put(hideBatchOpsModal())
    }

    const response = yield* ajaxCall(
      api.opMuiscToPlaylist,
      payload.trackIds,
      payload.pid.toString(),
      'add'
    )

    if (response.code === 200) {
      yield put(toastAction('success', '已收藏到歌单'))
      yield put({
        type: 'personal/playlist'
      })
    } else if (response.code === 502) {
      yield put(toastAction('warning', '歌曲已存在'))
    }
  }
}

export function* toCommentPage () {
  while (true /* istanbul ignore next  */) {
    yield take('playlists/router/comment')

    yield put({
      type: 'ui/popup/track/hide'
    })

    const track: api.ITrack = yield select(((state: any) => state.playlist.track))

    yield call(InteractionManager.runAfterInteractions)

    yield Router.toComment({ route: { track, id: track.commentThreadId } })()
  }
}

export function* toCreatePlaylistPage () {
  while (true /* istanbul ignore next  */) {
    const { payload } = yield take('playlists/router/create')

    if (payload) {
      yield put({
        type: 'ui/popup/collect/hide'
      })

      yield call(InteractionManager.runAfterInteractions)
    }

    yield Router.toCreatePlaylist({ route: { trackId: payload } })
  }
}

export default function* watchPlaylist () {
  yield all([
    fork(syncPlaylistDetail),
    fork(subscribePlaylist),
    fork(popupTrackActionSheet),
    fork(popupCollectActionSheet),
    fork(collectTrackToPlayliast),
    fork(toCommentPage),
    fork(toCreatePlaylistPage),
    takeLatest('playlists/refresh', refreshPlaylist),
    takeLatest('playlists/sync', syncPlaylists)
  ])
}
