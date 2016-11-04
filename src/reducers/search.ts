import { handleActions, Action, Reducer } from 'redux-actions'
import {
  ISearchPayload,
  ISearchState
} from '../interfaces'
import { assign } from '../utils'

const reducerTypes = ['playlist', 'song', 'album', 'artist']

const actionTypes = ['start', 'end', 'save', 'query']

const initialState: ISearchState = Object.assign({}, {
  query: '',
  activeTab: 0
}, reducerTypes.reduce((obj: any, key: string) => {
  obj[key] = {
    // no need a pluralize function in our case
    [`${key}s`]: [],
    more: true,
    offset: 0,
    isLoading: false,
    query: ''
  }
  return obj
}, {}))

function deepperMerge (state: any, key: string, mergedObj: {}) {
  return Object.assign({}, state, { [key]: Object.assign({}, state[key] , mergedObj) })
}

function reducerGennerator (): Reducer<any, ISearchState> {
  const reducers: any  = {}

  reducerTypes.forEach(reducer => {
    actionTypes.forEach(action => {
      const key = `search/${reducer}/${action}`
      reducers[key] = (state: any, { payload, meta }: Action<any>) => {
        let stateToBeChanged = {}
        if (action === 'start') {
          stateToBeChanged = { isLoading: true }
        } else if (action === 'end') {
          stateToBeChanged = { isLoading: false }
        } else if (action === 'save') {
          stateToBeChanged = {
            [`${reducer}s`]: payload,
            offset: meta.offset,
            more: meta.more
          }
        } else if (action === 'query') {
          // TODO:
          // 这个 reducer 实际上是 cache prev state
          // 避免 query 没有改变的时候重复请求
          // 看看以后有没有办法用 middleware 一起处理这类情况
          stateToBeChanged = { query : state.query }
        }
        return deepperMerge(state, reducer, stateToBeChanged)
      }
    })
  })

  return reducers
}

export default handleActions(Object.assign({}, {
  'search/activeTab' (state: any, { payload }: Action<any>) {
    return assign(state, { activeTab: payload })
  },
  'search/query' (state: any, { payload = { query : ''} }: Action<ISearchPayload>) {
    return assign(assign(initialState, { activeTab: state.activeTab }),
      { query: payload.query }
    )
  }
}, reducerGennerator()), initialState)
