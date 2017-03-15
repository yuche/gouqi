import { put, fork, select } from 'redux-saga/effects'
import { IPlayerState } from '../reducers/player'
import { findIndex, sample } from 'lodash'
import { playTrackAction } from '../actions'
import { takeLatest, takeEvery } from 'redux-saga'
import { get } from 'lodash'
import {
  changeStatusAction,
  currentTimeAction,
  addSecondsAction
} from '../actions'
import {
  AsyncStorage
} from 'react-native'
import * as api from '../services/api'
import { ajaxCall } from './common'
import MusicControl from 'react-native-music-control/index.ios.js'

function* nextTrack () {
  const playerState: IPlayerState = yield select((state: any) => state.player)

  const { mode, playingTrack, playlist, seconds } = playerState

  yield fork(AsyncStorage.setItem, 'SECONDS', seconds.toString())

  const length = playlist.length

  if (length) {
    if (mode === 'SEQUE') {
      const trackIndex = findIndex(playlist, { id: playingTrack })
      const track = trackIndex === length
        ? playlist[0]
        : playlist[trackIndex + 1]
      yield put(playTrackAction({
        playingTrack: track.id
      }))
    }

    if (mode === 'RANDOM') {
      const track = sample(playlist)
      yield put(playTrackAction({
        playingTrack: track.id
      }))
    }

  }
}

function* prevTrack () {
  const playerState: IPlayerState = yield select((state: any) => state.player)

  const { history, playlist, playingTrack, seconds } = playerState

  yield fork(AsyncStorage.setItem, 'SECONDS', seconds.toString())

  if (playlist.length) {
    const historyLength = history.length
    if (historyLength > 1) {
      yield put(playTrackAction({
        playingTrack: history[historyLength - 2].id,
        prev: true
      }))
    }

    if (historyLength === 1) {
      const trackIndex = findIndex(playlist, { id: playingTrack })
      const track = trackIndex === 0
        ? playlist[playlist.length - 1]
        : playlist[trackIndex - 1]
      yield put(playTrackAction({
        playingTrack: track.id,
        prev: true
      }))
    }

  }
}

function* playTrack ({ payload: { playingTrack, prev } }) {
  const playerState: IPlayerState = yield select((state: any) => state.player)
  const { playlist } = playerState
  if (playlist.length) {
    const track = playlist.find(t => t.id === playingTrack)
    let uri = get(track, 'mp3Url', '')
    if (uri.startsWith('http')) {
      const response = yield* ajaxCall(api.batchSongDetailsNew, [playingTrack.toString()])
      if (response.code === 200) {
        uri = response.data[0].url
      }
    }
    yield put({
      type: 'player/track/play',
      payload: uri
    })
    yield put(currentTimeAction(0))
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
  const history = yield select((state: any) => state.player.history.filter(h => h.id !== payload))

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
    takeLatest('player/history/delete', delelteHistory)
  ]
}
