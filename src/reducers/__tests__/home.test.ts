import reducers from '../home'
import { initialState } from '../home'

test('home/recommend/start', () => {
  expect(
    reducers(initialState, {
      type: 'home/recommend/start'
    })
  ).toEqual({
    ...initialState,
    isLoading: true
  })
})

test('home/recommend/end', () => {
  expect(
    reducers(initialState, {
      type: 'home/recommend/end'
    })
  ).toEqual({
    ...initialState,
    isLoading: false
  })
})

test('home/recommend/save', () => {
  expect(
    reducers(initialState, {
      type: 'home/recommend/save',
      payload: {
        albums: [],
        artists: []
      }
    })
  ).toEqual({
    ...initialState,
    albums: [],
    artists: []
  })
})
