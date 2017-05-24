import reducers from '../playlist'
import { initialState } from '../playlist'

test('playlists/sync/start', () => {
  expect(
    reducers(initialState, {
      type: 'playlists/sync/start'
    })
  ).toEqual({
    ...initialState,
    isLoading: true
  })
})

test('playlists/refresh/start', () => {
  expect(
    reducers(initialState, {
      type: 'playlists/refresh/start'
    })
  ).toEqual({
    ...initialState,
    isRefreshing: true
  })
})

test('playlists/sync/end', () => {
  expect(
    reducers(initialState, {
      type: 'playlists/sync/end'
    })
  ).toEqual({
    ...initialState,
    isLoading: false
  })
})
test('playlists/refresh/end', () => {
  expect(
    reducers(initialState, {
      type: 'playlists/refresh/end'
    })
  ).toEqual({
    ...initialState,
    isRefreshing: false
  })
})

test('playlists/sync/save', () => {
  expect(
    reducers(initialState, {
      type: 'playlists/sync/save',
      payload: [],
      meta: {
        more: true,
        offset: 0
      }
    })
  ).toEqual({
    ...initialState,
    more: true,
    offset: 0
  })
})

test('playlists/track/save', () => {
  expect(
    reducers(initialState, {
      type: 'playlists/track/save',
      payload: {}
    })
  ).toEqual(initialState)
})
