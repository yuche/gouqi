import { handleActions, Action } from 'redux-actions'
import { assign } from '../utils'
import {
  IToastPayload
} from '../interfaces'

export default handleActions({
  'ui/toast' (state: any, {
    payload = {
      kind: 'error',
      text: '错误传参'
    }
  }: Action<IToastPayload> ) {
    return Object.assign({}, state, {
      toast: {
        kind: payload.kind,
        text: payload.text
      }
    })
  }
}, {toast: { kind: 'success', text: ''}})
