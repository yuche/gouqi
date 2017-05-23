import * as actions from '../../actions'
import { testSaga } from 'redux-saga-test-plan'
import { AsyncStorage } from 'react-native'
import { takeLatest, takeEvery, fork } from 'redux-saga/effects'
import {
  syncPlaylists,
  refreshPlaylist,
  syncPlaylistDetail,
  playlistSelector,
  subscribePlaylist,
  popupTrackActionSheet,
  popupCollectActionSheet,
  collectTrackToPlayliast,
  toCommentPage,
  toCreatePlaylistPage,
  batchOpsVisableSelector
 } from '../playlist'
import mainSaga from '../playlist'
import { InteractionManager } from 'react-native'

test('playlistSelector', () => {
  expect(playlistSelector({ details: { playlist: [] } })).toEqual([])
})

test('mainSaga', () => {
  testSaga(mainSaga)
    .next()
    .all([
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
    .next()
    .isDone()
})

test('syncPlaylistDetail', () => {
  const payload = 1
  testSaga(syncPlaylistDetail)
    .next()
    .take('details/playlist')
    .next({ payload })
    .select(playlistSelector)
    .next({ [payload]: 'playlist' })
    .restart()
    .next()
    .take('details/playlist')
    .next({ payload })
    .select(playlistSelector)
    .next({ [payload]: false })
    .put({
      type: 'details/playlist/start'
    })
    .next()
    .save('ajax')
    .next({ code: 200, result: [] })
    .call(InteractionManager.runAfterInteractions)
    .next()
    .put({
      type: 'details/playlist/save',
      payload: {
        [payload]: []
      }
    })
    .next()
    .restore('ajax')
    .next({ code: 404 })
    .call(InteractionManager.runAfterInteractions)
    .next()
    .put({
      type: 'details/playlist/end'
    })
    .next()
    .finish()
    .isDone()
})

test('subscribePlaylist', () => {
  const payload = 1
  testSaga(subscribePlaylist)
    .next()
    .take('details/playlist/subscribe')
    .next({payload})
    .select(playlistSelector)
    .next({
      [payload]: {
        subscribed: false,
        subscribedCount: 100
      }
    })
    .put({
      type: 'details/subscribe/start'
    })
    .next()
    .next({ code: 200 })
    .put({
      type: 'details/playlist/save',
      payload: {
        [payload]: {
          subscribedCount: 101,
          subscribed: true
        }
      }
    })
    .next()
    .back(2)
    .next({ code: 404 })
    .put({
      type: 'details/subscribe/end'
    })
    .next()
    .finish()
    .isDone()
})

test('unsubscribePlaylist', () => {
  const payload = 1
  testSaga(subscribePlaylist)
    .next()
    .take('details/playlist/subscribe')
    .next({ payload })
    .select(playlistSelector)
    .next({
      [payload]: {
        subscribed: true,
        subscribedCount: 100
      }
    })
    .put({
      type: 'details/subscribe/start'
    })
    .next()
    .next({ code: 200 })
    .put({
      type: 'details/playlist/save',
      payload: {
        [payload]: {
          subscribedCount: 99,
          subscribed: false
        }
      }
    })
    .next()
    .put({
      type: 'details/subscribe/end'
    })
    .next()
    .finish()
    .isDone()
})

test('popupTrackActionSheet', () => {
  const payload = 'three watch'
  testSaga(popupTrackActionSheet)
    .next()
    .take('playlists/track/popup')
    .next({ payload })
    .put({
      type: 'ui/popup/track/show'
    })
    .next()
    .put({
      type: 'playlists/track/save',
      payload
    })
    .next()
    .finish()
    .next()
    .isDone()
})

test('popupCollectActionSheet', () => {
  testSaga(popupCollectActionSheet)
    .next()
    .take('playlists/collect/popup')
    .next()
    .put({
      type: 'ui/popup/track/hide'
    })
    .next()
    .call(InteractionManager.runAfterInteractions)
    .next()
    .put({
      type: 'ui/popup/collect/show'
    })
    .next()
    .finish()
    .next()
    .isDone()
})

describe('collectTrackToPlayliast', () => {
  const payload = {
    trackIds: [],
    pid: 10086
  }

  test('batchOpsVisableSelector', () => {
    expect(batchOpsVisableSelector({
      ui: { modal: { playlist: { visible: true } } }
    })).toEqual(true)
  })

  test('batchOpsVisable is true and not collect yet', () => {
    testSaga(collectTrackToPlayliast)
      .next()
      .take('playlists/collect')
      .next({ payload })
      .select(batchOpsVisableSelector)
      .next(true)
      .put({
        type: 'ui/popup/collect/hide'
      })
      .next()
      .call(InteractionManager.runAfterInteractions)
      .next()
      .put(actions.hideBatchOpsModal())
      .next()
      .next({ code: 200 })
      .put(actions.toastAction('success', '已收藏到歌单'))
      .next()
      .put({
        type: 'personal/playlist'
      })
      .next()
      .finish()
      .next()
      .isDone()
  })

  test('batchOpsVisable is true and ( collected || ajax failed )', () => {
    testSaga(collectTrackToPlayliast)
      .next()
      .take('playlists/collect')
      .next({ payload })
      .select(batchOpsVisableSelector)
      .next(false)
      .put({
        type: 'ui/popup/collect/hide'
      })
      .next()
      .next({ code: 502 })
      .put(actions.toastAction('warning', '歌曲已存在'))
      .next()
      .back(2)
      .next({ code: 404 })
      .finish()
      .next()
      .isDone()
  })
})
