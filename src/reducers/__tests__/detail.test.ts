import reducers from '../detail'
import { initialState } from '../detail'

test('details/playlist/start', () => {
  expect(
    reducers(initialState, {
      type: 'details/playlist/start'
    })
  ).toEqual({
    ...initialState,
    isLoading: true
  })
})

test('details/subscribe/start', () => {
  expect(
    reducers(initialState, {
      type: 'details/subscribe/start'
    })
  ).toEqual({
    ...initialState,
    subscribing: true
  })
})

test('details/subscribe/end', () => {
  expect(
    reducers(initialState, {
      type: 'details/subscribe/end'
    })
  ).toEqual({
    ...initialState,
    subscribing: false
  })
})

test('details/playlist/end', () => {
  expect(
    reducers(initialState, {
      type: 'details/playlist/end'
    })
  ).toEqual({
    ...initialState,
    isLoading: false
  })
})

test('details/playlist/save', () => {
  expect(
    reducers(initialState, {
      type: 'details/playlist/save',
      payload: {
        a: 123
      }
    })
  ).toEqual({
    ...initialState,
    playlist: {
      a: 123
    }
  })
})

test('details/album/save', () => {
  expect(
    reducers(initialState, {
      type: 'details/album/save',
      payload: {
        a: 123
      }
    })
  ).toEqual({
    ...initialState,
    albums: {
      a: 123
    }
  })
})
