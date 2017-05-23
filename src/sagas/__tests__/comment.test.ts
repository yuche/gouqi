import { testSaga } from 'redux-saga-test-plan'
import * as actions from '../../actions'
import { AsyncStorage } from 'react-native'
import mainSaga from '../comment'
import { syncComments, syncMoreComments, commentSelector } from '../comment'
import { takeEvery } from 'redux-saga/effects'
import { InteractionManager } from 'react-native'

test('syncComments', () => {
  const payload = 1
  testSaga(syncComments, { payload })
    .next()
    .put({
      type: 'comments/sync/start'
    })
    .next()
    .save('ajax')
    .next({code: 200})
    .call(InteractionManager.runAfterInteractions)
    .next()
    .put({
      type: 'comments/sync/save',
      payload: {
        [payload]: {
          code: 200,
          offset: 0
        }
      }
    })
    .next()
    .restore('ajax')
    .next({code: 404})
    .call(InteractionManager.runAfterInteractions)
    .next()
    .put({
      type: 'comments/sync/end'
    })
    .next()
    .isDone()
})

test('syncMoreComments', () => {
  const payload = 1
  testSaga(syncMoreComments, { payload })
    .next()
    .select(commentSelector)
    .next({
      [payload]: {
        more: true,
        offset: 0,
        hotComments: [],
        comments: []
      }
    })
    .put({
      type: 'comments/more/start'
    })
    .next()
    .next({ code: 200, comments: [1] })
    .put({
      type: 'comments/sync/save',
      payload: {
        [payload]: {
          code: 200,
          hotComments: [],
          comments: [1],
          offset: 30
        }
      }
    })
    .next()
    .back(2)
    .next({ code: 404 })
    .put({
      type: 'comments/more/end'
    })
    .next()
    .isDone()
})

test('syncMoreComments when no more comments', () => {
  const payload = 1
  testSaga(syncMoreComments, { payload })
    .next()
    .select(commentSelector)
    .next({ more: false})
    .put(actions.toastAction('info', '所有资源已经加载完毕'))
    .next()
    .isDone()
})

test('commentSelector', () => {
  expect(commentSelector({ comment: { comments: [] } })).toEqual([])
})

test('mainSaga', () => {
  testSaga(mainSaga)
    .next()
    .all([
      takeEvery('comments/sync', syncComments),
      takeEvery('comments/more', syncMoreComments)
    ])
    .next()
    .isDone()
})
