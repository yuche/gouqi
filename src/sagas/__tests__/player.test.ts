import { takeLatest, takeEvery } from 'redux-saga/effects'
import {
  nextTrack,
  playerStateSelector,
  randomNumber,
  prevTrack,
  getLyrcis,
  playPersonalFM,
  watchLyricShow,
  playTrack,
  setHisotrySaga,
  delelteHistory,
  removePlaylist,
  clearPlaylistSaga,
  watchCurrentTime,
  watchStatus
} from '../player'
import mainSaga from '../player'
import { testSaga } from 'redux-saga-test-plan'
import * as actions from '../../actions'
import { AsyncStorage } from 'react-native'
import * as MusicControl from 'react-native-music-control/index.ios.js'

const playerState = (mode = 'SEQUE') => ({
  mode,
  playing: {
    pid: '0',
    index: 0
  },
  playlist: [{ id: 1 }, { id: 2 }],
  seconds: 1,
  history: [],
  lyrics: {},
  lyricsVisable: true,
  currentTime: 110
})

const AJAX_RESPONSE_SUCCESS = { code: 200 }

const AJAX_RESPONSE_FAIL = { code: 404 }

describe('player utils', () => {
  test('player selector', () => {
    const state = {
      player: 1
    }
    expect(playerStateSelector(state)).toBe(1)
  })

  // useless function just for coverage
  // see: https://softwareengineering.stackexchange.com/questions/147134/how-should-i-test-randomness
  test('random number', () => {
    expect(randomNumber(10e7, 0)).toBeGreaterThanOrEqual(0)
  })
  test('random number equal zero', () => {
    expect(randomNumber(0, 0)).toBe(0)
  })
})

describe('nextTrack', () => {

  test('normal seque play', () => {
    testSaga(nextTrack)
      .next()
      .select(playerStateSelector)
      .next(playerState())
      .put(actions.playTrackAction({
        playing: {
          index: 1
        }
      }))
      .next()
      .fork(AsyncStorage.setItem, 'SECONDS', '1')
      .next()
      .isDone()
  })

  test('fm play', () => {
    testSaga(nextTrack)
      .next()
      .select(playerStateSelector)
      .next({
        ...playerState(),
        playing: {
          pid: 'fm',
          index: 0
        },
        playlist: [1]
      })
      .save('ajax call')
      .next({code: 200, data: []})
      .put({
        type: 'player/playlist/merge',
        payload: []
      })
      .next()
      .restore('ajax call')
      .next(AJAX_RESPONSE_FAIL)
      .put(actions.playTrackAction({
        playing: {
          index: 0
        }
      }))
      .next()
      .fork(AsyncStorage.setItem, 'SECONDS', '1')
      .next()
      .isDone()
  })

  test('random play', () => {
    testSaga(nextTrack)
      .next()
      .select(playerStateSelector)
      .next(playerState('RANDOM'))
      .call(randomNumber, 1, 0)
      .next(0)
      .put(actions.playTrackAction({
        playing: {
          index: 0
        }
      }))
      .next()
      .fork(AsyncStorage.setItem, 'SECONDS', '1')
      .next()
      .isDone()
  })
})

describe('prevTrack', () => {

  test('normal prev track', () => {
    testSaga(prevTrack)
      .next()
      .select(playerStateSelector)
      .next({
        ...playerState(),
        history: [{id: 1}, {id: 2}, { id: 3 }]
      })
      .put(actions.playTrackAction({
        playing: {
          index: 1
        },
        prev: true
      }))
      .next()
      .fork(AsyncStorage.setItem, 'SECONDS', '1')
      .next()
      .isDone()
  })

  test('prev track when history is empty and playing first track', () => {
    testSaga(prevTrack)
      .next()
      .select(playerStateSelector)
      .next(playerState())
      .put(actions.playTrackAction({
        playing: {
          index: 1
        },
        prev: true
      }))
      .next()
      .fork(AsyncStorage.setItem, 'SECONDS', '1')
      .next()
      .isDone()
  })

  test('prev track when history is empty', () => {
    testSaga(prevTrack)
      .next()
      .select(playerStateSelector)
      .next({
        ...playerState(),
        playing: {
          pid: '0',
          index: 1
        }
      })
      .put(actions.playTrackAction({
        playing: {
          index: 0
        },
        prev: true
      }))
      .next()
      .fork(AsyncStorage.setItem, 'SECONDS', '1')
      .next()
      .isDone()
  })
})

describe('getLyrics', () => {
  test('getLyrics', () => {
    testSaga(getLyrcis)
      .next()
      .select(playerStateSelector)
      .next(playerState())
      .put({ type: 'player/lyric/start' })
      .next()
      .save('ajax')
      .next(AJAX_RESPONSE_SUCCESS)
      .put({
        type: 'player/lyric/save',
        payload: {
          1: []
        }
      })
      .next()
      .restore('ajax')
      .next(AJAX_RESPONSE_FAIL)
      .put({ type: 'player/lyric/end'})
      .next()
      .isDone()
  })

  test('do nothing when already has cache', () => {
    testSaga(getLyrcis)
      .next()
      .select(playerStateSelector)
      .next({
        ...playerState(),
        lyrics: {
          1: 'some lrc'
        }
      })
      .isDone()
  })
})

describe('playPersonalFM', () => {
  const data = []
  test('playPersonalFM', () => {
    testSaga(playPersonalFM)
      .next()
      .put(actions.playTrackAction({
        playing: {
          index: 0,
          pid: 'fm'
        }
      }))
      .next()
      .save('ajax')
      .next({ ...AJAX_RESPONSE_SUCCESS, data})
      .put({
        type: 'player/mode',
        payload: 'SEQUE'
      })
      .next()
      .put(actions.playTrackAction({
        playing: {
          index: 0,
          pid: 'fm'
        },
        playlist: data
      }))
      .restore('ajax')
      .next(AJAX_RESPONSE_FAIL)
      .next()
      .isDone()
  })
})

describe('watch sagas', () => {
  test('watchLyricShow', () => {
    testSaga(watchLyricShow)
      .next()
      .fork(getLyrcis)
      .next()
      .isDone()
  })

  test('clearPlaylistSaga', () => {
    testSaga(clearPlaylistSaga)
      .next()
      .put(actions.shrinkPlayer())
      .next()
      .put(actions.setPlaylistTracks([]))
      .next()
      .put(actions.hidePlaylistPopup())
      .next()
      .put(actions.playTrackAction({
        playing: {
          pid: 0,
          index: 0
        }
      }))
      .next()
      .isDone()
  })

  test('watchCurrentTime', () => {
    testSaga(watchCurrentTime)
      .next()
      .put(actions.addSecondsAction())
      .next()
      .isDone()
  })

  test('watchStatus PLAYING', () => {
    testSaga(watchStatus, { payload: { status: 'PLAYING' } })
      .next()
      .select(playerStateSelector)
      .next(playerState())
      .fork(MusicControl.updatePlayback, {
        state: MusicControl.STATE_PLAYING,
        elapsedTime: 110
      })
      .next()
      .isDone()
  })

  test('watchStatus PAUSED', () => {
    testSaga(watchStatus, { payload: { status: 'PAUSED' } })
      .next()
      .select(playerStateSelector)
      .next(playerState())
      .fork(MusicControl.updatePlayback, {
        state: MusicControl.STATE_PAUSED,
        elapsedTime: 110
      })
      .next()
      .isDone()
  })

  test('mainSaga', () => {
    testSaga(mainSaga)
      .next()
      .all([
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
  })
})

describe('playTrack', () => {
  test('saveOnly returns false', () => {
    testSaga(playTrack, actions.playTrackAction({
      playing: {
        index: 0
      },
      saveOnly: true
    }))
    .next()
    .returns(false)
    .next()
    .isDone()
  })

  test('play on error returns false', () => {
    testSaga(playTrack, actions.playTrackAction({
      playing: {
        index: 0
      },
      prev: true
    }))
    .next()
    .put(actions.changeStatusAction('PAUSED'))
    .next()
    .select(playerStateSelector)
    .next(playerState())
    .put({ type: 'player/lyric' })
    .next()
    .next({...AJAX_RESPONSE_SUCCESS, data: [{ url: '' }]})
    .put(actions.toastAction('error', '播放出现错误'))
    .next()
    .returns(false)
  })

  test('play track success', () => {
    testSaga(playTrack, actions.playTrackAction({
      playing: {
        index: 0
      }
    }))
    .next()
    .put(actions.changeStatusAction('PAUSED'))
    .next()
    .select(playerStateSelector)
    .next(playerState())
    .put({ type: 'player/lyric' })
    .next()
    .next({...AJAX_RESPONSE_SUCCESS, data: [{ url: 'add1s.com' }]})
    .put({
      type: 'player/track/play',
      payload: 'add1s.com'
    })
    .next()
    .put(actions.changeStatusAction('PLAYING'))
    .next()
    .put({
      type: 'player/history/merge',
      payload: {
        id: 1
      }
    })
    .next()
    .isDone()
  })

  test('play prev track', () => {
    testSaga(playTrack, actions.playTrackAction({
      playing: {
        index: 0
      },
      prev: true
    }))
      .next()
      .put(actions.changeStatusAction('PAUSED'))
      .next()
      .select(playerStateSelector)
      .next(playerState())
      .put({ type: 'player/lyric' })
      .next()
      .next({ ...AJAX_RESPONSE_SUCCESS, data: [{ url: 'add1s.com' }] })
      .put({
        type: 'player/track/play',
        payload: 'add1s.com'
      })
      .next()
      .put(actions.changeStatusAction('PLAYING'))
      .next()
      .isDone()
  })
})

describe('history saga', () => {

  test('setHistorySaga', () => {
    testSaga(setHisotrySaga)
      .next()
      .select(playerStateSelector)
      .next(playerState())
      .fork(AsyncStorage.setItem, 'HISTORY', JSON.stringify([]))
      .next()
      .isDone()
  })

  test('delelteHistory', () => {
    testSaga(delelteHistory, { payload: 0 })
      .next()
      .select(playerStateSelector)
      .next({
        ...playerState(),
        history: [1]
      })
      .put({
        type: 'player/history/save',
        payload: []
      })
      .next()
      .isDone()
  })
})

describe('removePlaylist', () => {

  test('when playlist length <= 1', () => {
    testSaga(removePlaylist, { payload: 0 })
      .next()
      .select(playerStateSelector)
      .next({
        ...playerState(),
        playlist: [{ id: 0 }]
      })
      .put(actions.clearPlaylist())
      .next()
      .isDone()
  })

  test('when remove current track', () => {
    testSaga(removePlaylist, { payload: 0 })
      .next()
      .select(playerStateSelector)
      .next(playerState())
      .put(actions.setPlaylistTracks([{ id: 2 }]))
      .next()
      .put(actions.playTrackAction({
        playing: {
          index: 0
        }
      }))
      .next()
      .isDone()
  })

  test('when remove current track and current playing last track', () => {
    testSaga(removePlaylist, { payload: 1 })
      .next()
      .select(playerStateSelector)
      .next({
        ...playerState(),
        playing: {
          index: 1,
          pid: '0'
        }
      })
      .put(actions.setPlaylistTracks([{ id: 1 }]))
      .next()
      .put(actions.playTrackAction({
        playing: {
          index: 0
        }
      }))
      .next()
      .isDone()
  })

  test('when playing index > removing index', () => {
    testSaga(removePlaylist, { payload: 1 })
      .next()
      .select(playerStateSelector)
      .next({
        ...playerState(),
        playing: {
          index: 2,
          pid: '0'
        },
        playlist: [{ id: 1 }, { id: 2 }, { id: 3 }]
      })
      .put(actions.setPlaylistTracks([{ id: 1 }, { id: 3 }]))
      .next()
      .put(actions.playTrackAction({
        playing: {
          index: 1
        },
        saveOnly: true
      }))
      .next()
      .isDone()
  })
})
