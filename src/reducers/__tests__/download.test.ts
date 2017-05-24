import reducers from '../download'
import { initialState } from '../download'

test('download/tracks/merge', () => {
  expect(
    reducers(initialState, {
      type: 'download/tracks/merge',
      payload: []
    })
  ).toEqual({
    ...initialState,
    tracks: []
  })
})

test('download/failed/merge', () => {
  expect(
    reducers(initialState, {
      type: 'download/failed/merge',
      payload: []
    })
  ).toEqual({
    ...initialState,
    failed: []
  })
})

test('download/downloading/merge', () => {
  expect(
    reducers(initialState, {
      type: 'download/downloading/merge',
      payload: []
    })
  ).toEqual({
    ...initialState,
    downloading: []
  })
})

test('download/downloading/clear', () => {
  expect(
    reducers(initialState, {
      type: 'download/downloading/clear',
      payload: []
    })
  ).toEqual({
    ...initialState,
    downloading: [],
    failed: [],
    progress: {}
  })
})

test('download/downloading/set', () => {
  expect(
    reducers(initialState, {
      type: 'download/downloading/set',
      payload: []
    })
  ).toEqual({
    ...initialState,
    downloading: []
  })
})

test('download/tracks/set', () => {
  expect(
    reducers(initialState, {
      type: 'download/tracks/set',
      payload: []
    })
  ).toEqual({
    ...initialState,
    tracks: []
  })
})

test('download/progress', () => {
  expect(
    reducers(initialState, {
      type: 'download/progress',
      payload: {
        id: 1,
        total: 100,
        receive: 99
      } as any
    })
  ).toEqual({
    ...initialState,
    progress: {
      1: {
        total: 100,
        receive: 99
      }
    }
  })
})

test('download/downloading/remove', () => {
  expect(
    reducers({
      ...initialState,
      downloading: [{ id: 1 } as any]
    }, {
      type: 'download/downloading/remove',
      payload: 1
    } as any)
  ).toEqual({
    ...initialState,
    downloading: []
  })
})

test('download/failed/remove', () => {
  expect(
    reducers({
      ...initialState,
      failed: [{ id: 1 } as any]
    }, {
      type: 'download/failed/remove',
      payload: 1
    } as any)
  ).toEqual({
    ...initialState,
    failed: []
  })
})
