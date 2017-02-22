import { handleActions, Action } from 'redux-actions'
import { assign } from '../utils'
import {
  IToastPayload
} from '../interfaces'

const initState = {
  toast: { kind: 'success', text: ''},
  popup: {
    track: {
      visible: false,
      id: 0
    },
    collect: {
      visible: false,
      id: 0
    }
  }
}

const next = () => {
  let n = 1
  return () => n++
}

const toastId = next()
const trackId = next()
const collectId = next()

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
        text: payload.text,
        id: toastId()
      }
    })
  },
  'ui/popup/track/show' (state) {
    return {
      ...state,
      popup: {
        ...state.popup,
        track: {
          visible: true,
          id: trackId()
        }
      }
    }
  },
  'ui/popup/collect/show' (state) {
    return {
      ...state,
      popup: {
        ...state.popup,
        collect: {
          visible: true,
          id: collectId()
        }
      }
    }
  },
  'ui/popup/track/hide' (state) {
    return {
      ...state,
      popup: {
        ...state.popup,
        track: {
          visible: false,
          id: trackId()
        }
      }
    }
  },
  'ui/popup/collect/hide' (state) {
    return {
      ...state,
      popup: {
        ...state.popup,
        collect: {
          visible: false,
          id: collectId()
        }
      }
    }
  }
}, initState)
