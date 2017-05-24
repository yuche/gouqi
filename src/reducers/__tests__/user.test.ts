import { initialState } from '../user'
import reducers from '../user'

test('user/login/start', () => {
  expect(
    reducers(initialState, {
      type: 'user/login/start'
    })
  ).toEqual({
    ...initialState,
    isLoading: true
  })
})
test('user/login/end', () => {
  expect(
    reducers(initialState, {
      type: 'user/login/end'
    })
  ).toEqual({
    ...initialState,
    isLoading: false
  })
})
