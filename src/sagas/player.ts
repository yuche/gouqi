import { put, fork, select } from 'redux-saga/effects'
import { IPlayerState } from '../reducers/player'
import { random, get, findIndex } from 'lodash'
import { playTrackAction } from '../actions'
import { takeLatest, takeEvery } from 'redux-saga'
import {
  changeStatusAction,
  currentTimeAction,
  addSecondsAction,
  toastAction
} from '../actions'
import {
  AsyncStorage
} from 'react-native'
import * as api from '../services/api'
import { ajaxCall } from './common'
import MusicControl from 'react-native-music-control/index.ios.js'

function* nextTrack () {
  const playerState: IPlayerState = yield select((state: any) => state.player)

  const { mode, playing, playlist, seconds } = playerState

  const length = playlist.length

  if (length) {
    if (mode === 'SEQUE') {
      const index = Number(playing.index)
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
      const index = random(length - 1)
      yield put(playTrackAction({
        playing: {
          index
        }
      }))
    }
  }

  yield fork(AsyncStorage.setItem, 'SECONDS', seconds.toString())

}

function* prevTrack () {
  const playerState: IPlayerState = yield select((state: any) => state.player)

  const { history, playlist, playing, seconds } = playerState

  yield fork(AsyncStorage.setItem, 'SECONDS', seconds.toString())

  if (playlist.length) {
    const historyLength = history.length
    const historyTrack = history[historyLength - 2]
    const index = historyTrack && findIndex(playlist, t => t.id === historyTrack.id)
    if (index) {
      yield put(playTrackAction({
        playing: {
          index
        },
        prev: true
      }))
    } else {
      const index = playing.index
      yield put(playTrackAction({
        playing: {
          index: index === 0 ? playlist.length - 1 : index - 1
        },
        prev: true
      }))
    }
  }
}

function* getLyrcis({ payload }) {
  const lyrics = yield select((state: any) => state.player.lyrics)
  if (!lyrics[payload]) {
    yield put({ type: 'player/lyric/start' })
    const response = yield* ajaxCall(api.getLyric, payload)
    if (response.code === 200) {
      yield put({
        type: 'player/lyric/save',
        payload: {
          [payload]: response.lyrics
        }
      })
    }
    yield put({ type: 'player/lyric/end' })
  }
}

function* playPersonalFM() {
  yield put(playTrackAction({
    playing: {
      index: 0,
      pid: 'fm'
    }
  }))
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

function* playTrack ({ payload: { playing, prev } }) {
  const playerState = yield select((state: any) => state.player)
  const { playlist } = playerState
  yield put(currentTimeAction(0))
  if (playerState.lyricsVisable && playlist[playing.index] && playlist[playing.index].id) {
    yield put({
      type: 'player/lyric',
      payload: playlist[playing.index].id
    })
  }
  if (playlist.length) {
    const track = playlist[playing.index]
    let uri = get(track, 'mp3Url', '')
    if (uri.startsWith('http') || !uri) {
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
}

function* setHisotrySaga () {
  const history = yield select((state: any) => state.player.history)

  yield fork(AsyncStorage.setItem, 'HISTORY', JSON.stringify(history))
}

function* delelteHistory ({ payload }) {
  const history = yield select((state: any) => state.player.history.filter((_, index) => index !== payload))

  yield put({
    type: 'player/history/save',
    payload: history
  })
}

function* watchStatus ({ payload: {status} }) {
  const currentTime = yield select((state: any) => state.player.currentTime)
  if (status === 'PLAYING') {
    MusicControl.updatePlayback({
      state: MusicControl.STATE_PLAYING,
      elapsedTime: currentTime
    })
  }
  if (status === 'PAUSED') {
    MusicControl.updatePlayback({
      state: MusicControl.STATE_PAUSED,
      elapsedTime: currentTime
    })
  }
}

function* watchCurrentTime() {
  yield put(addSecondsAction())
}

export default function* watchPlayer () {
  yield [
    takeLatest('player/track/next', nextTrack),
    takeLatest('player/track/prev', prevTrack),
    takeEvery('player/status', watchStatus),
    takeLatest('player/play', playTrack),
    takeEvery('player/currentTime', watchCurrentTime),
    takeLatest('player/history/merge', setHisotrySaga),
    takeLatest('player/history/save', setHisotrySaga),
    takeLatest('player/history/delete', delelteHistory),
    takeLatest('player/fm/play', playPersonalFM),
    takeEvery('player/lyric', getLyrcis)
  ]
}
