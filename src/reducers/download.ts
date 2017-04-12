import { handleActions } from 'redux-actions'
import { ITrack } from '../services/api'
import { Action } from 'redux-actions'
import { isEmpty } from 'lodash'

interface IDownloadState {
  tracks: ITrack[],
  progress: {
    [props: number]: number
  },
  failed: ITrack[],
  deleted: number[],
  downloading: ITrack[]
}

const initialState: IDownloadState = {
  tracks: [],
  progress: {},
  failed: [],
  deleted: [],
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
      downloading: state.downloading.filter(t => t.id !== payload)
    }
  },
  'download/deleted/merge' (state, { payload }: any) {
    return {
      ...state,
      deleted: state.deleted.concat(payload)
    }
  },
  'download/deleted/clear' (state) {
    return {
      ...state,
      deleted: []
    }
  },
  'download/failed/remove' (state, { payload }: any) {
    return {
      ...state,
      failed: isEmpty(state.failed)
        ? []
        : state.failed.filter(t => t.id !== payload)
    }
  },
  'download/progress' (state, { payload, meta }: any) {
    return {
      ...state,
      progress: {
        ...state.progress,
        [meta]: payload
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
