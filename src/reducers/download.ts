import { handleActions } from 'redux-actions'
import { ITrack } from '../services/api'
import { Action } from 'redux-actions'

interface IDownloadState {
  tracks: ITrack[]
}

const initialState: IDownloadState = {
  tracks: []
}

export default handleActions({
  'download/tracks/merge' (state, { payload }: any) {
    return {
      ...state,
      tracks: state.tracks.concat(payload)
    }
  },
  'download/tracks/set' (state, { payload }: Action<ITrack[]>) {
    return {
      ...state,
      tracks: payload
    }
  }
}, initialState)
