import { take, put, call, select } from 'redux-saga/effects'
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

export function* syncSearchResource (
  type: number,
  reducerType: string,
  picUrlKey: string,
  picSize = '100y100'
) {
  yield take(`search/${reducerType}`)

  const resourceKey = reducerType + 's'

  const searchState = yield select((state: any) => state.search)

  const { query = '' } = searchState

  const state = searchState[reducerType]

  const counterKey = `${reducerType}Count`

  if (state && state.more && query) {
    yield put({
      type: `search/${reducerType}/start`
    })

    const offsetState = state.offset + 15

    const response = yield* ajaxCall(
      api.search, query, type.toString(), '15',
      state.offset
    )

    if (response.code === 200) {
      const result = response.result
      const resource: any[] = result[resourceKey]

      if (resource) {
        yield put({
          type: `search/${reducerType}/save`,
          payload: picUrlKey ? state[resourceKey].concat(resource.map((p) => {
            return Object.assign({}, p, {
              [picUrlKey]: p[picUrlKey] === null ?
              // TODO:
              // placeholder image. maybe use local image instead 
              PLACEHOLDER_IMAGE :
              p[picUrlKey] + `?param=${picSize}`
            })
          })) : state[resourceKey].concat(resource),
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

export function* ajaxCall (fn: (...args: any[]) => Promise<any>, ...args: any[]) {
  const res = yield call(fn, ...args)
  if (res.error) {
    if (res.error.message === '未登录') {
      yield Router.toLogin()()
    } else {
      yield put(toastAction('error', '网络出现错误...'))
    }
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
  // tslint:disable-next-line:only-arrow-functions
  return function* () {
    const selectedState: IMoreResult = yield select((state: any) => state[stateKey])

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
          payload: selectedState[action].concat(changeCoverImgUrl(result[action])),
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
        payload: changeCoverImgUrl(response[action]),
        meta: {
          more: true,
          offset: 0
        }
      })
    }

    yield put({
      type: `${action}/refresh/end`
    })
  }
}
