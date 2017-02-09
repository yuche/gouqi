import { handleActions } from 'redux-actions'
import * as api from '../services/api'

export interface IinitialState {
  playlist: ITracks,
  isLoading: boolean
}

export interface ITracks {
  [props: number]: api.IPlaylist
}

const initialState: IinitialState = {
  playlist: {},
  isLoading: false
}

export default handleActions({
  'details/playlist/start' (state) {
    return {
      ...state,
      isLoading: true
    }
  },
  'details/playlist/end' (state) {
    return {
      ...state,
      isLoading: false
    }
  },
  'details/playlist/save' (state: IinitialState, { payload }) {
    return {
      ...state,
      playlist: {
        ...state.playlist,
        ...payload
      }
    }
  }
}, initialState)
