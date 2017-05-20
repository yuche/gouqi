import { take, put, fork, select, call } from 'redux-saga/effects'
import {
  toastAction
} from '../actions'
import * as api from '../services/api'
import { ajaxCall } from './common'
import {
  InteractionManager
} from 'react-native'

function* syncComments () {
  while (true) {
    const { payload } = yield take('comments/sync')

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
}

function* syncMoreComments () {
  while (true) {
    const { payload } = yield take('comments/more')

    const commentsState: api.IComments  = yield select((state: any) => state.comment.comments[payload])

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
}

export default function* rootSaga () {
  yield fork(syncComments)
  yield fork(syncMoreComments)
}
