import { handleActions, Action } from 'redux-actions'
import { ISearchPayload } from '../interfaces'

export default handleActions({
  'search/query' (state: any, { payload = { query : ''} }: Action<ISearchPayload>) {
    return Object.assign({}, state, { query: payload.query })
  }
}, { query: '' })
