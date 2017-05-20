import { nextTrack, playerStateSelector } from '../player'
import { testSaga } from 'redux-saga-test-plan'
import * as actions from '../../actions'
import { AsyncStorage } from 'react-native'

describe('nextTrack', () => {

  const playerState = (mode = 'SEQUE') => ({
    mode,
    playing: {
      pid: '0',
      index: 0
    },
    playlist: [1],
    seconds: 1
  })

  test('正常顺序播放', () => {
    testSaga(nextTrack)
      .next()
      .select(playerStateSelector)
      .next(playerState())
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
