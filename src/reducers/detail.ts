import { handleActions } from 'redux-actions'
import * as api from '../services/api'

export interface IinitialState {
  playlist: IPlaylists,
  subscribing: boolean,
  isLoading: boolean
}

export interface IPlaylists {
  [props: number]: api.IPlaylist
}

const initialState: IinitialState = {
  playlist: {},
  subscribing: false,
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
  },
  'details/subscribe/start' (state) {
    return {
      ...state,
      subscribing: true
    }
  },
  'details/subscribe/end' (state) {
    return {
      ...state,
      subscribing: false
    }
  },
}, initialState)
