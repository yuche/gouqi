import { take, put, call, fork, select } from 'redux-saga/effects'
import { emitter } from '../utils'
import { IPlayerState, IPlayPayload } from '../reducers/player'
import { findIndex, sample } from 'lodash'
import { playTrackAction } from '../actions'
import { takeLatest } from 'redux-saga'

function* nextTrack () {
  const playerState: IPlayerState = yield select((state: any) => state.player)

  const { mode, playingTrack, playlist } = playerState

  const length = playlist.length

  if (length) {
    emitter.emit('song.change')

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
    emitter.emit('song.change')
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

export default function* watchPlayer () {
  yield* takeLatest('player/track/next', nextTrack)
  yield* takeLatest('player/track/prev', prevTrack)
}
