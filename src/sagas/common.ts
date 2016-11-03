import { take, put, call, fork, select } from 'redux-saga/effects'
import { Pattern } from 'redux-saga'
import * as api from '../services/api'

import {
  toastAction
} from '../actions'

interface IMoreResult {
  more: boolean,
  offset: number,
  query?: string,
  [propName: string]: any
}

export function* syncSearchResource (
  type: number,
  action: Pattern,
  resourceKey: string,
  picUrlKey: string,
  stateSelector: (state: any) => any,
  resultSelector: (res: any) => any[],
  counterSelector: (res: any) => number,
  picSize = '100y100'
) {
  yield take(action)

  const { query = '' } = yield select((state: any) => state.search)
  const state: IMoreResult = yield select(stateSelector)

  if (state.more && query) {
    yield put({
      type: `${action}/start`
    })

    const offsetState = state.offset + 15

    const response = yield call(
      api.search, query, type.toString(), '15', offsetState.toString()
    )

    const resource = resultSelector(response)

    if (resource) {
      yield put({
        type: `${action}/save`,
        payload: picUrlKey ? state[resourceKey].concat(resource.map((p) => {
          return Object.assign({}, p, {
            [picUrlKey]: p[picUrlKey] + `?param=${picSize}`
          })
        })) : state[resourceKey].concat(resource),
        meta: {
          more: counterSelector(response) > offsetState ? true : false,
          offset: offsetState
        }
      })
    } else {
      yield put(toastAction('info', '什么也找不到'))
    }

  } else {
    yield put(toastAction('info', '没有更多了'))
  }

  yield put({
    type: `${action}/end`
  })
}

export function* syncMoreResource (
  action: Pattern,
  resourceKey: string,
  caller: () => Promise<any>,
  stateSelector: (state: any) => any,
  resultSelector: (result: any) => any[],
  picSize = '100y100'
) {
  yield take(action)

  const state: IMoreResult = yield select(stateSelector)

  if (state.more) {
    yield put({
      type: `${action}/start`
    })

    const offsetState = state.offset + 15
    const result = yield call(
      caller, '15', offsetState.toString()
    )

    yield put({
      type: `${action}/save`,
      payload: state[resourceKey].concat(resultSelector(result).map(p => {
        return Object.assign({}, p, {
          coverImgUrl: p.coverImgUrl + `?param=${picSize}`
        })
      })),
      meta: {
        more: result.more,
        offset: offsetState
      }
    })
  } else {
    yield put(toastAction('info', '没有更多资源了'))
  }

  yield put({
    type: `${action}/end`
  })
}
