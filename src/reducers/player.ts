import { handleActions, Action } from 'redux-actions'
import { ITrack } from '../services/api'
import { uniqueId } from 'lodash'
import { ILyric } from '../interfaces'

export interface IPlayerState {
  playing: IPlaying,
  status: IPlayerStatus,
  playlist: ITrack[],
  mode: IPlayerMode,
  history: ITrack[],
  uri: string,
  currentTime: number,
  duration: number,
  seconds: number,
  loadingLyric: boolean,
  lyrics: {
    [props: number]: ILyric[]
  },
  slideTime: number,
  isSliding: boolean,
  shrink: string,
  lyricsVisable: boolean
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
  prev?: boolean,
  saveOnly?: boolean,
  playing: {
    pid?: IPlayingType,
    index: number
  }
}

export const initialState: IPlayerState = {
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
  seconds: 0,
  loadingLyric: false,
  lyrics: {},
  slideTime: 0,
  isSliding: false,
  shrink: '0',
  lyricsVisable: false
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
  'player/lyric/save' (state, { payload }: any) {
    return {
      ...state,
      lyrics: {
        ...state.lyrics,
        ...payload
      }
    }
  },
  'player/lyric/end' (state) {
    return {
      ...state,
      loadingLyric: false
    }
  },
  'player/lyric/show' (state) {
    return {
      ...state,
      lyricsVisable: true
    }
  },
  'player/lyric/hide' (state) {
    return {
      ...state,
      lyricsVisable: false
    }
  },
  'player/shrink' (state) {
    return {
      ...state,
      shrink: uniqueId()
    }
  },
  'player/lyric/start' (state) {
    return {
      ...state,
      loadingLyric: true
    }
  },
  'player/playlist/merge' (state, { payload }: any) {
    return {
      ...state,
      playlist: state.playlist.concat(payload)
    }
  },
  'player/playlist/save' (state, { payload }: any) {
    return {
      ...state,
      playlist: payload
    }
  },
  'player/history/merge' (state, { payload }: any) {
    const { history } = state
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
  'player/status' (state, { payload: { status } }: any) {
    return {
      ...state,
      status
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
  'player/slideTime' (state, { payload }: any) {
    return {
      ...state,
      slideTime: payload
    }
  },
  'player/slide' (state, { payload }: any) {
    return {
      ...state,
      isSliding: payload
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
