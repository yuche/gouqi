import reducers from '../personal'
import { initialState } from '../personal'

test('personal/daily/start', () => {
  expect(
    reducers(initialState, {
      type: 'personal/daily/start'
    })
  ).toEqual({
    ...initialState,
    isLoading: true
  })
})

test('personal/daily/end', () => {
  expect(
    reducers(initialState, {
      type: 'personal/daily/end'
    })
  ).toEqual({
    ...initialState,
    isLoading: false
  })
})

test('personal/daily/save', () => {
  expect(
    reducers(initialState, {
      type: 'personal/daily/save',
      payload: []
    })
  ).toEqual({
    ...initialState,
    daily: []
  })
})

test('personal/profile', () => {
  expect(
    reducers(initialState, {
      type: 'personal/profile',
      payload: []
    })
  ).toEqual({
    ...initialState,
    profile: []
  })
})

test('personal/playlist/save', () => {
  expect(
    reducers(initialState, {
      type: 'personal/playlist/save',
      payload: {
        tracks: []
      }
    })
  ).toEqual({
    ...initialState,
    playlist: {
      tracks: [],
      created: [],
      collect: []
    }
  })
})
