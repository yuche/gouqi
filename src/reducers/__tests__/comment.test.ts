import reducers from '../comment'
import { initialState } from '../comment'

test('comments/sync/start', () => {
  expect(
    reducers(initialState, {
      type: 'comments/sync/start'
    })
  ).toEqual({
    ...initialState,
    isLoading: true
  })
})

test('comments/sync/end', () => {
  expect(
    reducers(initialState, {
      type: 'comments/sync/end'
    })
  ).toEqual({
    ...initialState,
    isLoading: false
  })
})

test('comments/sync/save', () => {
  expect(
    reducers(initialState, {
      type: 'comments/sync/save',
      payload: {
        1: 123
      }
    })
  ).toEqual({
    ...initialState,
    comments: {
      1: 123
    }
  })
})

test('comments/more/end', () => {
  expect(
    reducers(initialState, {
      type: 'comments/more/end'
    })
  ).toEqual({
    ...initialState,
    isLoadingMore: false
  })
})
test('comments/more/start', () => {
  expect(
    reducers(initialState, {
      type: 'comments/more/start'
    })
  ).toEqual({
    ...initialState,
    isLoadingMore: true
  })
})
