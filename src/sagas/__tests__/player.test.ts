import { nextTrack, playerStateSelector, randomNumber } from '../player'
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
    playlist: [1, 2],
    seconds: 1
  })

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

  // useless function just for coverage
  // see: https://softwareengineering.stackexchange.com/questions/147134/how-should-i-test-randomness
  test('random number', () => {
    expect(randomNumber(10e7, 0)).toBeGreaterThanOrEqual(0)
  })
})
