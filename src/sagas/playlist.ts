import { take, put, fork, select, call } from 'redux-saga/effects'
import {
  toastAction
} from '../actions'
import * as api from '../services/api'
import {
  InteractionManager
} from 'react-native'
import {
  syncMoreResource,
  ajaxCall
} from './common'
import Router from '../routers'

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

function* subscribePlaylist () {
  while (true) {
    const { payload }: { payload: number } = yield take('details/playlist/subscribe')

    const playlist: api.IPlaylist = yield select((state: any) => state.details.playlist[payload])

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

function* collectTrackToPlayliast () {
  while (true) {
    const { payload } = yield take('playlists/collect')

    yield put({
      type: 'ui/popup/collect/hide'
    })

    const response = yield* ajaxCall(
      api.opMuiscToPlaylist,
      payload.trackIds.toString(),
      payload.pid.toString(),
      'add'
    )

    if (response.code === 200) {
      yield put(toastAction('success', '已收藏到歌单'))
    } else if (response.code === 502) {
      yield put(toastAction('warning', '歌曲已存在'))
    }
  }
}

function* toCommentPage () {
  while (true) {
    yield take('playlists/router/comment')

    yield put({
      type: 'ui/popup/track/hide'
    })

    const track: api.ITrack = yield select(((state: any) => state.playlist.track))

    yield call(InteractionManager.runAfterInteractions)

    yield Router.toComment({ route: { track, id: track.commentThreadId } })()
  }
}

function* toCreatePlaylistPage () {
  while (true) {
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
  yield fork(syncPlaylists)
  yield fork(syncPlaylistDetail)
  yield fork(subscribePlaylist)
  yield fork(popupTrackActionSheet)
  yield fork(popupCollectActionSheet)
  yield fork(collectTrackToPlayliast)
  yield fork(toCommentPage)
  yield fork(toCreatePlaylistPage)
}
