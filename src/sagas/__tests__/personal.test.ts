import { testSaga } from 'redux-saga-test-plan'
import * as actions from '../../actions'
import { AsyncStorage } from 'react-native'
import mainSaga from '../personal'
import {
  createPlaylist,
  syncDailyRecommend,
  syncPersonnalPlaylist,
  deletePlaylist,
  playlistSelector
} from '../personal'
import { takeEvery, takeLatest } from 'redux-saga/effects'
import { InteractionManager } from 'react-native'
import Router from '../../routers'
import * as api from '../../services/api'

test('mainSaga', () => {
  testSaga(mainSaga)
    .next()
    .all([
      takeLatest('personal/daily', syncDailyRecommend),
      takeEvery('personal/playlist/create', createPlaylist),
      takeEvery('personal/playlist/delete', deletePlaylist),
      takeEvery('personal/playlist', syncPersonnalPlaylist)
    ])
    .next()
    .isDone()
})

describe('createPlaylist', () => {

  test('if name is NOT provided', () => {
    const payload = {
      trackId: 1
    }
    testSaga(createPlaylist, { payload })
      .next()
      .put(actions.toastAction('warning', '歌单名称不能为空'))
      .next()
      .isDone()
  })

  test('if name is provided', () => {
    const payload = {
      trackId: 1,
      name: 'hong kong reporter'
    }
    testSaga(createPlaylist, { payload })
      .next()
      .fork(Router.pop)
      .next()
      .save('before ajax')
      .next({ code: 200, id: 'run fast' })
      .put({
        type: 'playlists/collect',
        payload: {
         pid: 'run fast',
         trackIds: payload.trackId
        }
      })
      .next()
      .put({
        type: 'personal/playlist'
      })
      .next()
      .restore('before ajax')
      .next({ code: 404 })
      .isDone()
  })

  test('if trackId is not provided', () => {
    const payload = {
      name: 'hong kong reporter'
    }
    testSaga(createPlaylist, { payload })
      .next()
      .fork(Router.pop)
      .next()
      .next({ code: 200 })
      .put(actions.toastAction('success', '成功创建歌单'))
      .next()
      .put({
        type: 'personal/playlist'
      })
      .next()
      .isDone()
  })
})

test('playlistSelector', () => expect(playlistSelector({ personal: { playlist: [] } })).toEqual([]))

test('deletePlaylist', () => {
  const payload = 1
  testSaga(deletePlaylist, { payload })
    .next()
    .select(playlistSelector)
    .next({ collect: [{ id: 1 }], created: [{ id: 1}, { id: 2 }] })
    .put({
      type: 'personal/playlist/save',
      payload: {
        created: [{ id: 2 }],
        collect: []
      }
    })
    .next()
    .next({ code: 200 })
    .put(actions.toastAction('success', '成功删除歌单'))
    .next()
    .back(2)
    .next({ code: 404 })
    .isDone()
})

describe('syncPersonnalPlaylist', () => {
  test('when is not login', () => {
    testSaga(syncPersonnalPlaylist)
      .next()
      .call(api.getUserId)
      .next(null)
      .isDone()
  })

  test('when logined', () => {
    const playlist = [{
      creator: {
        userId: 'excited'
      }
    }, {
      creator: {
        userId: 'unexcited'
      }
    }]
    testSaga(syncPersonnalPlaylist)
      .next()
      .call(api.getUserId)
      .next('excited')
      .call(api.userPlayList)
      .next({
        code: 200,
        playlist
      })
      .put({
        type: 'personal/playlist/save',
        payload: {
          created: [playlist[0]],
          collect: [playlist[1]]
        }
      })
      .next()
      .isDone()
  })

  test('ajax failed', () => {
    testSaga(syncPersonnalPlaylist)
      .next()
      .call(api.getUserId)
      .next('excited')
      .call(api.userPlayList)
      .next({ code: 404 })
      .isDone()
  })
})

test('syncDailyRecommend', () => {
  testSaga(syncDailyRecommend)
    .next()
    .put({
      type: 'personal/daily/start'
    })
    .next()
    .call(InteractionManager.runAfterInteractions)
    .next()
    .next({ code: 200, recommend: [] })
    .put({
      type: 'personal/daily/save',
      payload: []
    })
    .next()
    .back(2)
    .next({ code: 404 })
    .put({
      type: 'personal/daily/end'
    })
    .next()
    .isDone()
})
