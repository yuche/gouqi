import { take, put, fork, select, call } from 'redux-saga/effects'
import {
  toastAction
} from '../actions'
import * as api from '../services/api'
import {
  InteractionManager
} from 'react-native'

function* syncComments () {
  while (true) {
    const { payload } = yield take('comments/sync')

    yield put({
      type: 'comments/sync/start'
    })

    try {
      const response: api.IComments = yield call(
        api.getComments,
        payload,
        '30',
        '0'
      )

      yield call(InteractionManager.runAfterInteractions)

      yield put({
        type: 'comments/sync/save',
        payload: {
          [payload]: {
            ...response,
            offset: 0
          }
        }
      })
    } catch (error) {
      yield put(toastAction('error', '网络出现错误...'))
    } finally {
      yield put({
        type: 'comments/sync/end'
      })
    }
  }
}

function* syncMoreComments () {
  while (true) {
    const { payload } = yield take('comments/more')

    const commentsState: api.IComments  = yield select((state: any) => state.comment.comments[payload])

    if (commentsState.more) {
      yield put({
        type: 'comments/more/start'
      })

      const offset = commentsState.offset + 30

      try {
        const response: api.IComments = yield call(
          api.getComments,
          payload,
          '30',
          offset.toString()
        )
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
      } catch (error) {
        yield put(toastAction('error', '网络出现错误...'))
      } finally {
        yield put({
          type: 'comments/more/end'
        })
      }
    } else {
      yield put(toastAction('info', '所有资源已经加载完毕'))
    }

  }
}

export default function* rootSaga() {
  yield fork(syncComments)
  yield fork(syncMoreComments)
}
