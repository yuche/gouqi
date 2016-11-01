import { take, put, call, fork, select } from 'redux-saga/effects'
import { Pattern } from 'redux-saga'

import {
  toastAction
} from '../actions'

interface IMoreResult {
  more: boolean,
  offset: number,
  [propName: string]: any
}

export function* syncMoreResource (
  action: Pattern,
  effect: string,
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
      type: `${effect}/start`
    })

    const offsetState = state.offset + 15
    const result = yield call(
      caller, '15', offsetState.toString()
    )

    yield put({
      type: `${effect}/save`,
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
    type: `${effect}/end`
  })
}
