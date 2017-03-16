import { put, fork, select } from 'redux-saga/effects'
import { IPlayerState } from '../reducers/player'
import { random, get } from 'lodash'
import { playTrackAction } from '../actions'
import { takeLatest, takeEvery } from 'redux-saga'
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

  const { mode, playing, playlist, seconds } = playerState

  const length = playlist.length

  if (length) {
    if (mode === 'SEQUE') {
      const index = Number(playing.index)
      yield put(playTrackAction({
        playing: {
          index: index === length ? 0 : index + 1
        }
      }))
    }

    if (mode === 'RANDOM') {
      const index = random(length)
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

  const { playlist, playing, seconds } = playerState

  yield fork(AsyncStorage.setItem, 'SECONDS', seconds.toString())

  if (playlist.length) {
    const { index } = playing
    yield put(playTrackAction({
      playing: {
        index: index === 0 ? playlist.length - 1 : index - 1
      },
      prev: true
    }))
  }
}

function* playTrack ({ payload: { playing, prev } }) {
  const playerState: IPlayerState = yield select((state: any) => state.player)
  const { playlist } = playerState
  if (playlist.length) {
    const track = playlist[playing.index]
    let uri = get(track, 'mp3Url', '')
    if (uri.startsWith('http')) {
      const response = yield* ajaxCall(api.batchSongDetailsNew, [track.id])
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
    takeLatest('player/history/delete', delelteHistory)
  ]
}
