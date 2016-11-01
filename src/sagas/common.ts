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
  countKey: string,
  picUrlKey: string,
  stateSelector: (state: any) => any,
  resultSelector: (result: any) => any[],
  picSize = '100y100'
) {
  yield take(action)

  const { query } = yield select((state: any) => state.search)
  const state: IMoreResult = yield select(stateSelector)

  if (state.more) {
    yield put({
      type: `${action}/start`
    })

    const offsetState = state.offset + 15
    const result = yield call(
      api.search, query, type.toString(), '15', offsetState.toString()
    )

    yield put({
      type: `${action}/save`,
      payload: state[resourceKey].concat(resultSelector(result).map(p => {
        return Object.assign({}, p, {
          [picUrlKey]: p[picUrlKey] + `?param=${picSize}`
        })
      })),
      meta: {
        more: result[countKey] > offsetState ? true : false,
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
