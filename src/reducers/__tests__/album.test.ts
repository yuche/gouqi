import { initialState } from '../album'
import reducer from '../album'

test('albums/refresh/start', () => {
  expect(
    reducer(initialState, {
      type: 'albums/refresh/start'
    })
  ).toEqual({
    ...initialState,
    isRefreshing: true
  })
})

test('albums/refresh/end', () => {
  expect(
    reducer(initialState, {
      type: 'albums/refresh/end'
    })
  ).toEqual({
    ...initialState,
    isRefreshing: false
  })
})

test('albums/sync/end', () => {
  expect(
    reducer(initialState, {
      type: 'albums/sync/end'
    })
  ).toEqual({
    ...initialState,
    isLoading: false
  })
})

test('albums/sync/start', () => {
  expect(
    reducer(initialState, {
      type: 'albums/sync/start'
    })
  ).toEqual({
    ...initialState,
    isLoading: true
  })
})

test('albums/sync/save', () => {
  expect(
    reducer(initialState, {
      type: 'albums/sync/save',
      payload: []
    })
  ).toEqual({
    ...initialState,
    albums: [],
    more: true,
    offset: 0
  })
})

test('albums/sync/save meta', () => {
  expect(
    reducer(initialState, {
      type: 'albums/sync/save',
      payload: [],
      meta: {
        more: false,
        offset: 250
      }
    })
  ).toEqual({
    ...initialState,
    albums: [],
    more: false,
    offset: 250
  })
})
