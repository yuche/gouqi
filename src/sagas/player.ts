import { take, put, call, fork, select } from 'redux-saga/effects'
import { IPlayerState, IPlayPayload, IPlayerStatus } from '../reducers/player'
import { findIndex, sample } from 'lodash'
import { playTrackAction } from '../actions'
import { takeLatest } from 'redux-saga'
import { get } from 'lodash'
import { emitter } from '../utils'
import { changeStatusAction } from '../actions'
import { Action } from 'redux-actions'

// tslint:disable-next-line:no-var-requires
const MusicControl = require('react-native-music-control')

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
    const historyLength = history.length
    emitter.emit('song.change')
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

// function* playTrack () {
//   while (true) {
//     const { payload: { playingTrack, playlist } }: { payload: IPlayPayload } = yield take('player/play')

//     if (playlist) {
//       const track = playlist.find(t => t.id === playingTrack)
//       const uri = get(track, 'mp3Url')
//       yield put(changeStatusAction('PLAYING'))
//     }
//   }
// }

// function* watchStatus ({ payload }: Action<IPlayerStatus>) {
//   if (payload === 'PLAYING') {
//     console.log('playing')
//     yield MusicControl.updatePlayback({
//       state: MusicControl.STATE_PLAYING,
//       elapsedTime: 0
//     })
//   }
//   if (payload === 'PAUSED') {
//     console.log('pause')
//     yield MusicControl.updatePlayback({
//       state: MusicControl.STATE_PAUSED,
//       elapsedTime: 0
//     })
//   }
// }

export default function* watchPlayer () {
  yield [
    takeLatest('player/track/next', nextTrack),
    takeLatest('player/track/prev', prevTrack),
    // takeLatest('player/status', watchStatus),
    // fork(playTrack)
  ]
}
