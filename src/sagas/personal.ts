import { put, fork, select, call, takeLatest, takeEvery, all } from 'redux-saga/effects'
import {
  toastAction
} from '../actions'
import {
  InteractionManager
} from 'react-native'
import * as api from '../services/api'
import Router from '../routers'
import {
  ajaxCall
} from './common'

export function* createPlaylist ({ payload }: any) {
  const { trackId, name } = payload

  if (name) {
    yield fork(Router.pop)

    const response = yield* ajaxCall(api.createPlaylist, name)

    if (response.code === 200) {
      if (trackId) {
        const pid = response.id
        yield put({
          type: 'playlists/collect',
          payload: {
            pid,
            trackIds: trackId
          }
        })
      } else {
        yield put(toastAction('success', '成功创建歌单'))
      }
      yield put({type: 'personal/playlist'})
    }

  } else {
    yield put(toastAction('warning', '歌单名称不能为空'))
  }
}

export const playlistSelector = (state: any) => state.personal.playlist

export function* deletePlaylist ({ payload }: any) {
  let {collect, created} = yield select(playlistSelector)

  collect = collect.filter((t) => t.id !== payload)
  created = created.filter((t) => t.id !== payload)

  yield put({
    type: 'personal/playlist/save',
    payload: {
      created,
      collect
    }
  })

  const response = yield* ajaxCall(api.deletePlaylist, payload.toString())

  if (response.code === 200) {
    yield put(toastAction('success', '成功删除歌单'))
  }
}

export function* syncPersonnalPlaylist () {
  const userId = yield call(api.getUserId)

  if (userId) {
    const res = yield call(api.userPlayList)
    if (res.code === 200) {
      const playlists: api.IPlaylist[] = res.playlist
      const collect: api.IPlaylist[] = []
      const created: api.IPlaylist[] = []
      playlists.forEach((playlist) => {
        if (playlist.creator.userId.toString() === userId) {
          created.push(playlist)
        } else {
          collect.push(playlist)
        }
      })
      yield put({
        type: 'personal/playlist/save',
        payload: {
          created,
          collect
        }
      })
    }
  }
}

export function* syncDailyRecommend () {
  yield put({
    type: 'personal/daily/start'
  })

  yield call(InteractionManager.runAfterInteractions)

  const response = yield* ajaxCall(api.dailyRecommend)

  if (response.code === 200) {
    yield put({
      type: 'personal/daily/save',
      payload: response.recommend
    })
  }

  yield put({
    type: 'personal/daily/end'
  })
}

export default function* watchPersonal () {
  yield all([
    takeLatest('personal/daily', syncDailyRecommend),
    takeEvery('personal/playlist/create', createPlaylist),
    takeEvery('personal/playlist/delete', deletePlaylist),
    takeEvery('personal/playlist', syncPersonnalPlaylist)
  ])
}
