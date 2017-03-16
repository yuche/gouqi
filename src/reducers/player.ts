import { handleActions, Action } from 'redux-actions'
import { ITrack } from '../services/api'

export interface IPlayerState {
  playing: IPlaying,
  status: IPlayerStatus,
  playlist: ITrack[],
  mode: IPlayerMode,
  history: ITrack[],
  uri: string,
  currentTime: number,
  duration: number,
  seconds: number
}

export interface IPlaying {
  pid: IPlayingType,
  index: number
}

export type IPlayingType = number | 'history' | 'radio' | 'fm' | 'download' | 'daily'
export type IPlayerStatus = 'PLAYING' | 'PAUSED' | 'STOPPED' | 'FINISHED' | 'BUFFERING' | 'ERROR'
export type IPlayerMode = 'SEQUE' | 'REPEAT' | 'RANDOM'

export interface IPlayPayload {
  playlist?: ITrack[],
  prev?: boolean
  playing: {
    pid?: IPlayingType,
    index: number
  }
}

const initialState: IPlayerState = {
  playing: {
    pid: 0,
    index: 0
  },
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
    const { playlist, playing } = payload
    return playlist ? {
      ...state,
      playing: {
        ...state.playing,
        ...playing
      },
      playlist
    } : {
      ...state,
      playing: {
        ...state.playing,
        ...playing
      }
    }
  },
  'player/playlist/merge' (state, { payload }: any) {
    return {
      ...state,
      playlist: state.playlist.concat(payload)
    }
  },
  'player/history/merge' (state, { payload }: any) {
    let { history } = state
    if (history.length >= 101) {
      history.shift()
    }
    return {
      ...state,
      history: history.concat(payload || [])
    }
  },
  'player/history/save' (state, { payload }: any) {
    return {
      ...state,
      history: payload
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
  'player/currentTime' (state, { payload }: any) {
    return {
      ...state,
      currentTime: payload
    }
  },
  'player/duration' (state, { payload }: any) {
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
