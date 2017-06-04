import { handleActions } from 'redux-actions'
import { ITrack } from '../services/api'
import { Action } from 'redux-actions'

interface IDownloadState {
  tracks: ITrack[],
  progress: {
    [props: number]: {
      total: string,
      receive: string
    }
  },
  failed: ITrack[],
  downloading: ITrack[]
}

export const initialState: IDownloadState = {
  tracks: [],
  progress: {},
  failed: [],
  downloading: []
}

export default handleActions({
  'download/tracks/merge' (state, { payload }: any) {
    return {
      ...state,
      tracks: state.tracks.concat(payload)
    }
  },
  'download/failed/merge' (state, { payload }: any) {
    return {
      ...state,
      failed: state.failed.concat(payload)
    }
  },
  'download/downloading/set' (state, { payload }: any) {
    return {
      ...state,
      downloading: payload
    }
  },
  'download/downloading/remove' (state, { payload }: any) {
    return {
      ...state,
      downloading: state.downloading.filter((t) => t.id !== payload)
    }
  },
  'download/downloading/merge' (state, { payload }: any) {
    return {
      ...state,
      downloading: state.downloading.concat(payload)
    }
  },
  'download/downloading/clear' (state) {
    return {
      ...state,
      downloading: [],
      failed: [],
      progress: {}
    }
  },
  'download/failed/remove' (state, { payload }: any) {
    return {
      ...state,
      failed: state.failed.filter((t) => t.id !== payload)
    }
  },
  'download/progress' (state, { payload: { id, total, receive } }: any) {
    return {
      ...state,
      progress: {
        ...state.progress,
        [id]: {
          total,
          receive
        }
      }
    }
  },
  'download/tracks/set' (state, { payload }: Action<ITrack[]>) {
    return {
      ...state,
      tracks: payload
    }
  }
}, initialState)
