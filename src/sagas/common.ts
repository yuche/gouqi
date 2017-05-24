import { take, put, call, select } from 'redux-saga/effects'
import { END } from 'redux-saga'
import * as api from '../services/api'
import Router from '../routers'
import { PLACEHOLDER_IMAGE, changeCoverImgUrl } from '../utils'
import {
  toastAction
} from '../actions'

interface IMoreResult {
  more: boolean,
  offset: number,
  query?: string,
  [propName: string]: any
}

export const searchSelector = (state: any) => state.search

export function syncSearchResource (
  type: number,
  reducerType: string,
  picSize = 100
) {
  return function* () {
    while (true /* istanbul ignore next  */) {
      yield take(`search/${reducerType}`)

      const resourceKey = reducerType + 's'

      const searchState = yield select(searchSelector)

      const { query = '' } = searchState

      const state = searchState[reducerType]

      const counterKey = `${reducerType}Count`

      if (state && state.more && query) {
        yield put({
          type: `search/${reducerType}/start`
        })

        const offsetState = state.offset + 30

        const response = yield* ajaxCall(
          api.search, query, type.toString(), '30',
          state.offset
        )

        if (response.code === 200) {
          const result = response.result
          const resource: any[] = result[resourceKey]

          if (resource) {
            yield put({
              type: `search/${reducerType}/save`,
              payload: state[resourceKey].concat(changeCoverImgUrl(resource, picSize)),
              meta: {
                more: result[counterKey] > offsetState ? true : false,
                offset: offsetState
              }
            })
          } else {
            yield put(toastAction('info', '什么也找不到'))
          }
        }

      }

      yield put({
        type: `search/${reducerType}/end`
      })
    }
  }
}

export function* ajaxCall (fn: (...args: any[]) => Promise<any>, ...args: any[]) {
  const res = yield call(fn, ...args)
  if (res && res.error) {
    if (res.error.message === '未登录') {
      yield call(Router.toLogin)
    } else {
      yield put(toastAction('error', '网络出现错误...'))
    }
    yield put(END)
  }
  return res
}

export function syncMoreResource (
  action: string,
  stateKey: string,
  caller: () => Promise<any>,
  picSize = 300,
  limit = 30
) {
  return function* () {
    const state = yield select() // just for test convient
    const selectedState: IMoreResult = state[stateKey]

    if (selectedState.more) {
      yield put({
        type: `${action}/sync/start`
      })

      const offsetState = selectedState.offset + limit
      const result = yield* ajaxCall(
        caller, limit.toString(),
        selectedState.offset === 0 ? selectedState.offset.toString()  : offsetState.toString()
      )

      if (result.code === 200) {
        const more = result.more || offsetState < result.total
        yield put({
          type: `${action}/sync/save`,
          payload: selectedState[action].concat(changeCoverImgUrl(result[action], picSize)),
          meta: {
            more,
            offset: offsetState
          }
        })
      }

      yield put({
        type: `${action}/sync/end`
      })
    } else {
      yield put(toastAction('info', '没有更多资源了'))
    }
  }
}

export function refreshResource (
  action: string,
  caller: () => Promise<any>,
  width = 300,
  limit = '30'
) {
  // tslint:disable-next-line:only-arrow-functions
  return function* () {
    yield put({
      type: `${action}/refresh/start`
    })

    const response = yield* ajaxCall(caller, limit)

    if (response.code === 200) {
      yield put({
        type: `${action}/sync/save`,
        payload: changeCoverImgUrl(response[action], width),
        meta: {
          more: true,
          offset: Number(limit)
        }
      })
    }

    yield put({
      type: `${action}/refresh/end`
    })
  }
}
