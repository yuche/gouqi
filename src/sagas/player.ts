import { put, fork, select } from 'redux-saga/effects'
import { IPlayerState } from '../reducers/player'
import { random, get, findIndex, isEmpty } from 'lodash'
import { playTrackAction } from '../actions'
import { takeLatest, takeEvery } from 'redux-saga'
import {
  changeStatusAction,
  currentTimeAction,
  addSecondsAction,
  toastAction,
  slideTimeAction
} from '../actions'
import {
  AsyncStorage
} from 'react-native'
import * as api from '../services/api'
import { ajaxCall } from './common'
import MusicControl from 'react-native-music-control/index.ios.js'
import { parseLyrics } from '../utils'

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
  }
}

function* getLyrcis () {
  const playerState: IPlayerState = yield select((state: any) => state.player)
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

function* playPersonalFM () {
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

function* watchLyricShow () {
  yield fork(getLyrcis)
}

function* playTrack ({ payload: { playing, prev }  }) {
  yield put(changeStatusAction('PAUSED'))
  const playerState: IPlayerState = yield select((state: any) => state.player)
  const { playlist, lyricsVisable } = playerState
  if (lyricsVisable) {
    yield put({
      type: 'player/lyric'
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

function* watchCurrentTime () {
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
    takeEvery('player/lyric', getLyrcis),
    takeLatest('player/lyric/show', watchLyricShow)
  ]
}
