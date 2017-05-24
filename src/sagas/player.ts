import { put, fork, select, call, takeLatest, takeEvery, all } from 'redux-saga/effects'
import { IPlayerState } from '../reducers/player'
import { random, get, findIndex, isEmpty } from 'lodash'
import { playTrackAction } from '../actions'
import {
  changeStatusAction,
  currentTimeAction,
  addSecondsAction,
  toastAction,
  slideTimeAction,
  setPlaylistTracks,
  shrinkPlayer,
  hidePlaylistPopup,
  clearPlaylist
} from '../actions'
import {
  AsyncStorage
} from 'react-native'
import * as api from '../services/api'
import { ajaxCall } from './common'
import * as MusicControl from 'react-native-music-control/index.ios.js'
import { parseLyrics } from '../utils'
import { Action } from 'redux-actions'

export const playerStateSelector = (state: any) => state.player

export function randomNumber (total: number, except: number) {
  const num = random(total)
  return num !== except || total === 0 ? num : randomNumber(total, except)
}

export function* nextTrack () {
  const playerState: IPlayerState = yield select(playerStateSelector)

  const { mode, playing, playlist, seconds } = playerState

  const length = playlist.length
  let index = Number(playing.index)

  if (mode === 'SEQUE') {
    if (playing.pid === 'fm' && playlist.length - 1 === index) {
      const response = yield* ajaxCall(api.personalFM)
      if (response.code === 200) {
        yield put({
          type: 'player/playlist/merge',
          payload: response.data
        })
      }
    }
    yield put(playTrackAction({
      playing: {
        index: index + 1 === length ? 0 : index + 1
      }
    }))
  }

  if (mode === 'RANDOM') {
    index = yield call(randomNumber, length - 1, index)
    yield put(playTrackAction({
      playing: {
        index
      }
    }))
  }

  yield fork(AsyncStorage.setItem, 'SECONDS', seconds.toString())

}

export function* prevTrack () {
  const playerState: IPlayerState = yield select(playerStateSelector)

  const { history, playlist, playing, seconds } = playerState

  const historyLength = history.length
  const historyTrack = history[historyLength - 2]
  const index = historyTrack && findIndex(playlist, (t) => t.id === historyTrack.id)
  if (index) {
    yield put(playTrackAction({
      playing: {
        index
      },
      prev: true
    }))
  } else {
    const i = playing.index
    yield put(playTrackAction({
      playing: {
        index: i === 0 ? playlist.length - 1 : i - 1
      },
      prev: true
    }))
  }

  yield fork(AsyncStorage.setItem, 'SECONDS', seconds.toString())

}

export function* getLyrcis () {
  const playerState: IPlayerState = yield select(playerStateSelector)
  const { playlist, lyrics, playing } = playerState
  const id = (playlist[playing.index] && playlist[playing.index].id) || 0
  if (id && isEmpty(lyrics[id])) {
    yield put({ type: 'player/lyric/start' })
    const response = yield* ajaxCall(api.getLyric, id)
    if (response.code === 200) {
      const translation = get(response, 'tlyric.lyric', '')
      const lrc = get(response, 'lrc.lyric', '')
      yield put({
        type: 'player/lyric/save',
        payload: {
          [id]: parseLyrics(lrc, translation)
        }
      })
    }
    yield put({ type: 'player/lyric/end' })
  }
}

export function* playPersonalFM () {
  const response = yield* ajaxCall(api.personalFM)
  if (response.code === 200) {
    yield put({
      type: 'player/mode',
      payload: 'SEQUE'
    })
    yield put(playTrackAction({
      playing: {
        index: 0,
        pid: 'fm'
      },
      playlist: response.data
    }))
  }
}

export function* watchLyricShow () {
  yield fork(getLyrcis)
}

export function* playTrack ({ payload: { playing, prev, saveOnly } }: any) {
  if (saveOnly) {
    return false
  }
  yield put(changeStatusAction('PAUSED'))
  const playerState: IPlayerState = yield select(playerStateSelector)
  const { playlist, lyricsVisable } = playerState
  const track = playlist[playing.index]
  if (lyricsVisable) {
    yield put({
      type: 'player/lyric'
    })
  }
  let uri = get(track, 'mp3Url', '')
  if (isEmpty(uri) || uri.startsWith('http')) {
    const response = yield* ajaxCall(api.batchSongDetailsNew, [track.id])
    if (response.code === 200) {
      uri = response.data[0].url || uri
    }
  }
  if (!uri) {
    yield put(toastAction('error', '播放出现错误'))
    return false
  }
  yield put({
    type: 'player/track/play',
    payload: uri
  })
  yield put(changeStatusAction('PLAYING'))
  if (!prev) {
    yield put({
      type: 'player/history/merge',
      payload: track
    })
  }
}

export function* setHisotrySaga () {
  const { history } = yield select(playerStateSelector)

  yield fork(AsyncStorage.setItem, 'HISTORY', JSON.stringify(history))
}

export function* delelteHistory ({ payload }: any) {
  const { history } = yield select(playerStateSelector)

  yield put({
    type: 'player/history/save',
    payload: history.filter((_, index) => index !== payload)
  })
}

export function* removePlaylist ({ payload }: any) {
  const index = Number(payload)
  const playerState: IPlayerState = yield select(playerStateSelector)
  const { playlist, playing } = playerState
  if (playlist.length <= 1) {
    yield put(clearPlaylist())
  } else {
    yield put(setPlaylistTracks(
      playlist.filter((t, i) => i !== index)
    ))
    if (playing.index === index) {
      yield put(playTrackAction({
        playing: {
          index: index + 1 === playlist.length  ? index - 1 : index
        }
      }))
    } else if (playing.index > index) {
      yield put(playTrackAction({
        playing: {
          index: playing.index - 1
        },
        saveOnly: true
      }))
    }
  }
}

export function* clearPlaylistSaga () {
  yield put(shrinkPlayer())
  yield put(setPlaylistTracks([]))
  yield put(hidePlaylistPopup())
  yield put(playTrackAction({
    playing: {
      pid: 0,
      index: 0
    }
  }))
}

export function* watchStatus ({ payload: {status} }: any) {
  const { currentTime } = yield select(playerStateSelector)
  if (status === 'PLAYING') {
    yield fork(MusicControl.updatePlayback, {
      state: MusicControl.STATE_PLAYING,
      elapsedTime: currentTime
    })
  }
  if (status === 'PAUSED') {
    yield fork(MusicControl.updatePlayback, {
      state: MusicControl.STATE_PAUSED,
      elapsedTime: currentTime
    })
  }
}

export function* watchCurrentTime () {
  yield put(addSecondsAction())
}

export default function* watchPlayer () {
  yield all([
    takeLatest('player/track/next', nextTrack),
    takeLatest('player/track/prev', prevTrack),
    takeEvery('player/status', watchStatus),
    takeLatest('player/play', playTrack),
    takeEvery('player/currentTime', watchCurrentTime),
    takeLatest('player/history/merge', setHisotrySaga),
    takeLatest('player/history/save', setHisotrySaga),
    takeLatest('player/history/delete', delelteHistory),
    takeLatest('player/fm/play', playPersonalFM),
    takeEvery('player/lyric', getLyrcis),
    takeLatest('player/playlist/remove', removePlaylist),
    takeLatest('player/playlist/clear', clearPlaylistSaga),
    takeLatest('player/lyric/show', watchLyricShow)
  ])
}
