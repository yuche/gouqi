import { handleActions } from 'redux-actions'
import { assign } from '../utils'

const initialState = {
  isLoading: false
}

export default handleActions({
  'user/login/start' (state) {
    return assign(state, {
      isLoading: true
    })
  },

  'user/login/end' (state) {
    return assign(state, {
      isLoading: false
    })
  }
}, initialState)
