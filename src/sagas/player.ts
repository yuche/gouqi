import { take, put, call, fork, select } from 'redux-saga/effects'
import { IPlayerState, IPlayPayload, IPlayerStatus } from '../reducers/player'
import { findIndex, sample } from 'lodash'
import { playTrackAction } from '../actions'
import { takeLatest } from 'redux-saga'
import { get } from 'lodash'
import { emitter } from '../utils'
import { changeStatusAction } from '../actions'
import * as api from '../services/api'
import { ajaxCall } from './common'
import { Action } from 'redux-actions'
import MusicControl from 'react-native-music-control/index.ios.js'

function* nextTrack () {
  const playerState: IPlayerState = yield select((state: any) => state.player)

  const { mode, playingTrack, playlist } = playerState

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

  const { history, playlist, playingTrack } = playerState

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

function* playTrack ({ payload: { playingTrack } }) {
  const { playlist }: IPlayerState = yield select((state: any) => state.player)
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
    yield put(changeStatusAction('PLAYING', 0))
  }
}

function* watchStatus ({ payload: {status, currentTime} }) {
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

export default function* watchPlayer () {
  yield [
    takeLatest('player/track/next', nextTrack),
    takeLatest('player/track/prev', prevTrack),
    takeLatest('player/status', watchStatus),
    takeLatest('player/play', playTrack)
    // fork(playTrack)
  ]
}
