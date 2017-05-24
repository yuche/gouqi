import reducers from '../player'
import { initialState } from '../player'

test('player/lyric/end', () => {
  expect(
    reducers(initialState, {
      type: 'player/lyric/end'
    })
  ).toEqual({
    ...initialState,
    loadingLyric: false
  })
})

test('player/shrink', () => {
  expect(
    reducers(initialState, {
      type: 'player/shrink'
    })
  ).toEqual({
    ...initialState,
    shrink: '1'
  })
})

test('player/playlist/save', () => {
  expect(
    reducers(initialState, {
      type: 'player/playlist/save',
      payload: [] as any
    })
  ).toEqual({
    ...initialState,
    playlist: []
  })
})

test('player/playlist/merge', () => {
  expect(
    reducers(initialState, {
      type: 'player/playlist/merge',
      payload: [] as any
    })
  ).toEqual({
    ...initialState,
    playlist: []
  })
})

test('player/history/save', () => {
  expect(
    reducers(initialState, {
      type: 'player/history/save',
      payload: [] as any
    })
  ).toEqual({
    ...initialState,
    history: []
  })
})

test('player/status', () => {
  expect(
    reducers(initialState, {
      type: 'player/status',
      payload: { status: 'PLAYING' } as any
    })
  ).toEqual({
    ...initialState,
    status: 'PLAYING'
  })
})
test('player/duration', () => {
  expect(
    reducers(initialState, {
      type: 'player/duration',
      payload: 'PLAYING' as any
    })
  ).toEqual({
    ...initialState,
    duration: 'PLAYING'
  })
})

test('player/mode', () => {
  expect(
    reducers(initialState, {
      type: 'player/mode',
      payload: 'RANDOM'
    })
  ).toEqual({
    ...initialState,
    mode: 'RANDOM'
  })
})

test('🐸🐸🐸', () => {
  expect(
    reducers(initialState, {
      type: '🐸🐸🐸',
      payload: 110 as any
    })
  ).toEqual({
    ...initialState,
    seconds: 110
  })
})

test('🐸🐸🐸 string', () => {
  expect(
    reducers(initialState, {
      type: '🐸🐸🐸',
      payload: '110' as any
    })
  ).toEqual({
    ...initialState,
    seconds: 250
  })
})

test('player/currentTime', () => {
  expect(
    reducers(initialState, {
      type: 'player/currentTime',
      payload: 'RANDOM'
    })
  ).toEqual({
    ...initialState,
    currentTime: 'RANDOM'
  })
})

test('player/slideTime', () => {
  expect(
    reducers(initialState, {
      type: 'player/slideTime',
      payload: 'RANDOM'
    })
  ).toEqual({
    ...initialState,
    slideTime: 'RANDOM'
  })
})

test('player/slide', () => {
  expect(
    reducers(initialState, {
      type: 'player/slide',
      payload: 'RANDOM'
    })
  ).toEqual({
    ...initialState,
    isSliding: 'RANDOM'
  })
})

test('player/play with playlist', () => {
  expect(
    reducers(initialState, {
      type: 'player/play',
      payload: {
        playlist: [],
        playing: {
          index: 0
        }
      } as any
    })
  ).toEqual(initialState)
})

test('player/play without playlist', () => {
  expect(
    reducers(initialState, {
      type: 'player/play',
      payload: {
        playing: {
          index: 0
        }
      } as any
    })
  ).toEqual(initialState)
})

const addSeconds = (n: number) => '+'.repeat(n).split('').fill('1 seconds')

test('player/history/merge', () => {
  const history = addSeconds(101)

  expect(
    reducers({
      ...initialState,
      history
    } as any, {
      type: 'player/history/merge',
      payload: false
    } as any)
  ).toEqual({
    ...initialState,
    history: addSeconds(100)
  })
})

test('player/track/play', () => {
  expect(
    reducers(initialState, {
      type: 'player/track/play',
      payload: 'RANDOM'
    })
  ).toEqual({
    ...initialState,
    uri: 'RANDOM'
  })
})

test('player/lyric/show', () => {
  expect(
    reducers(initialState, {
      type: 'player/lyric/show'
    })
  ).toEqual({
    ...initialState,
    lyricsVisable: true
  })
})
test('player/lyric/hide', () => {
  expect(
    reducers(initialState, {
      type: 'player/lyric/hide'
    })
  ).toEqual({
    ...initialState,
    lyricsVisable: false
  })
})

test('player/lyric/start', () => {
  expect(
    reducers(initialState, {
      type: 'player/lyric/start'
    })
  ).toEqual({
    ...initialState,
    loadingLyric: true
  })
})

test('player/lyric/save', () => {
  expect(
    reducers(initialState, {
      type: 'player/lyric/save',
      payload: {
        tracks: []
      } as any
    })
  ).toEqual({
    ...initialState,
    lyrics: {
      tracks: []
    }
  })
})
