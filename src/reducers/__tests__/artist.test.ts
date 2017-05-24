import { initialState } from '../artist'
import reducer from '../artist'

test('artists/refresh/start', () => {
  expect(
    reducer(initialState, {
      type: 'artists/refresh/start'
    })
  ).toEqual({
    ...initialState,
    isRefreshing: true
  })
})

test('artists/favo/start', () => {
  expect(
    reducer(initialState, {
      type: 'artists/favo/start'
    })
  ).toEqual({
    ...initialState,
    isLoadingFavos: true
  })
})

test('artists/sync/start', () => {
  expect(
    reducer(initialState, {
      type: 'artists/sync/start'
    })
  ).toEqual({
    ...initialState,
    isLoading: true
  })
})

test('artists/sync/end', () => {
  expect(
    reducer(initialState, {
      type: 'artists/sync/end'
    })
  ).toEqual({
    ...initialState,
    isLoading: false
  })
})

test('artists/favo/end', () => {
  expect(
    reducer(initialState, {
      type: 'artists/favo/end'
    })
  ).toEqual({
    ...initialState,
    isLoadingFavos: false
  })
})

test('artists/detail/album/start', () => {
  expect(
    reducer(initialState, {
      type: 'artists/detail/album/start'
    })
  ).toEqual({
    ...initialState,
    isLoadingAlbums: true
  })
})

test('artists/detail/track/start', () => {
  expect(
    reducer(initialState, {
      type: 'artists/detail/track/start'
    })
  ).toEqual({
    ...initialState,
    isLoadingTracks: true
  })
})

test('artists/detail/track/end', () => {
  expect(
    reducer(initialState, {
      type: 'artists/detail/track/end'
    })
  ).toEqual({
    ...initialState,
    isLoadingTracks: false
  })
})

test('artists/detail/follow/end', () => {
  expect(
    reducer(initialState, {
      type: 'artists/detail/follow/end'
    })
  ).toEqual({
    ...initialState,
    isSubscribing: false
  })
})

test('artists/detail/follow/start', () => {
  expect(
    reducer(initialState, {
      type: 'artists/detail/follow/start'
    })
  ).toEqual({
    ...initialState,
    isSubscribing: true
  })
})

test('artists/sync/save', () => {
  expect(
    reducer(initialState, {
      type: 'artists/sync/save',
      payload: [],
      meta: {
        more: false,
        offset: 300
      }
    })
  ).toEqual({
    ...initialState,
    artists: [],
    more: false,
    offset: 300
  })
})

test('artists/detail/description/start', () => {
  expect(
    reducer(initialState, {
      type: 'artists/detail/description/start'
    })
  ).toEqual({
    ...initialState,
    isLoadingDescription: true
  })
})
test('artists/detail/description/end', () => {
  expect(
    reducer(initialState, {
      type: 'artists/detail/description/end'
    })
  ).toEqual({
    ...initialState,
    isLoadingDescription: false
  })
})

test('artists/detail/album/end', () => {
  expect(
    reducer(initialState, {
      type: 'artists/detail/album/end'
    })
  ).toEqual({
    ...initialState,
    isLoadingAlbums: false
  })
})

test('artists/favo/save', () => {
  expect(
    reducer(initialState, {
      type: 'artists/favo/save',
      payload: []
    })
  ).toEqual({
    ...initialState,
    favorites: []
  })
})

test('artists/refresh/end', () => {
  expect(
    reducer(initialState, {
      type: 'artists/refresh/end'
    })
  ).toEqual({
    ...initialState,
    isRefreshing: false
  })
})

test('artists/detail/track/save', () => {
  expect(
    reducer(initialState, {
      type: 'artists/detail/track/save',
      meta: 110,
      payload: {
        tracks: [],
        artist: []
      }
    })
  ).toEqual({
    ...initialState,
    detail: {
      110: {
        tracks: [],
        artist: []
      }
    }
  })
})

test('artists/detail/album/save', () => {
  expect(
    reducer(initialState, {
      type: 'artists/detail/album/save',
      meta: 110,
      payload: []
    })
  ).toEqual({
    ...initialState,
    detail: {
      110: {
        albums: []
      }
    }
  })
})

test('artists/detail/description/save', () => {
  expect(
    reducer(initialState, {
      type: 'artists/detail/album/save',
      meta: 110,
      payload: 'hong kong reporter fast'
    })
  ).toEqual({
    ...initialState,
    detail: {
      110: {
        description: 'hong kong reporter fast'
      }
    }
  })
})

test('artists/detail/follow/toggle', () => {
  expect(
    reducer(initialState, {
      type: 'artists/detail/follow/toggle',
      meta: 110,
      payload: false
    })
  ).toEqual({
    ...initialState,
    detail: {
      110: {
        artist: {
          followed: false
        }
      }
    }
  })
})
