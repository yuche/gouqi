import { handleActions, Action } from 'redux-actions'
import { ITrack } from '../services/api'

export interface IPlayerState {
  playingTrack: number,
  status: IPlayerStatus,
  playlist: ITrack[],
  mode: IPlayerMode,
  history: ITrack[],
  uri: string,
  currentTime: any,
  duration: any,
  seconds: any
}

export type IPlayerStatus = 'PLAYING' | 'PAUSED' | 'STOPPED' | 'FINISHED' | 'BUFFERING' | 'ERROR'
export type IPlayerMode = 'SEQUE' | 'REPEAT' | 'RANDOM'

export interface IPlayPayload {
  playlist?: ITrack[],
  prev?: boolean
  playingTrack: number
}

const initialState: IPlayerState = {
  playingTrack: 0,
  status: 'STOPPED',
  playlist: [],
  mode: 'SEQUE',
  history: [],
  uri: '',
  currentTime: 0,
  duration: 0,
  seconds: 0
}

export default handleActions({
  'player/play' (state, { payload }: any) {
    let track
    if (!payload.prev) {
      const id: number = payload.playingTrack
      track = state.playlist.find(t => t.id === id)
    }
    return {
      ...state,
      ...payload,
      history: state.history.concat(track || [])
    }
  },
  'player/status' (state, { payload }: any) {
    return {
      ...state,
      status: payload.status
    }
  },
  'player/mode' (state, { payload }: Action<IPlayerMode>) {
    return {
      ...state,
      mode: payload
    }
  },
  'player/track/play' (state, { payload }) {
    return {
      ...state,
      uri: payload
    }
  },
  'player/currentTime' (state, { payload }) {
    return {
      ...state,
      currentTime: payload
    }
  },
  'player/duration' (state, { payload }) {
    return {
      ...state,
      duration: payload
    }
  },
  '🐸🐸🐸' (state, { payload }) {
    return {
      ...state,
      seconds: typeof payload === 'number'
        ? payload
        : state.seconds + 250
    }
  }
}, initialState)
