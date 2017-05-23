import { put, fork, select, call, all, takeEvery } from 'redux-saga/effects'
import {
  toastAction
} from '../actions'
import * as api from '../services/api'
import { ajaxCall } from './common'
import {
  InteractionManager
} from 'react-native'

export function* syncComments ({ payload }: any) {
  yield put({
    type: 'comments/sync/start'
  })

  const response: api.IComments = yield* ajaxCall(
    api.getComments,
    payload,
    '30',
    '0'
  )

  yield call(InteractionManager.runAfterInteractions)

  if (response.code === 200) {
    yield put({
      type: 'comments/sync/save',
      payload: {
        [payload]: {
          ...response,
          offset: 0
        }
      }
    })
  }

  yield put({
    type: 'comments/sync/end'
  })
}

export const commentSelector = (state) => state.comment.comments

export function* syncMoreComments ({ payload }: any) {
  const comments = yield select(commentSelector)

  const commentsState = comments[payload]

  if (commentsState && commentsState.more) {
    yield put({
      type: 'comments/more/start'
    })

    const offset = commentsState.offset + 30

    const response: api.IComments = yield* ajaxCall(
      api.getComments,
      payload,
      '30',
      offset.toString()
    )

    if (response.code === 200) {
      yield put({
        type: 'comments/sync/save',
        payload: {
          [payload]: {
            ...response,
            hotComments: commentsState.hotComments,
            comments: commentsState.comments.concat(response.comments),
            offset
          }
        }
      })
    }

    yield put({
      type: 'comments/more/end'
    })

  } else {
    yield put(toastAction('info', '所有资源已经加载完毕'))
  }
}

export default function* rootSaga () {
  yield all([
    takeEvery('comments/sync', syncComments),
    takeEvery('comments/more', syncMoreComments)
  ])
}
