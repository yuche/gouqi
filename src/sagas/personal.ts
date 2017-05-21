import { take, put, fork, select, call, takeLatest } from 'redux-saga/effects'
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

function* createPlaylist () {
  while (true) {
    const { payload } = yield take('personal/playlist/create')

    const { trackId, name } = payload

    if (name) {
      yield Router.pop()

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
}

function* deletePlaylist () {
  while (true) {
    const { payload } = yield take('personal/playlist/delete')

    let {collect, created} = yield select((state: any) => state.personal.playlist)

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
}

export function* syncPersonnalPlaylist () {
  while (true) {
    yield take('personal/playlist')

    const userId = api.getUserId()

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
}

function* syncDailyRecommend () {
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
  yield fork(createPlaylist)
  yield fork(deletePlaylist)
  yield fork(syncPersonnalPlaylist)
  yield takeLatest('personal/daily', syncDailyRecommend)
}
