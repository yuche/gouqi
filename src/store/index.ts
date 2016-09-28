import {
  createStore,
  applyMiddleware
} from 'redux'
import rootReducer from '../reducers'
import createSagaMiddleware from 'redux-saga'
import sagas from '../sagas'

export default function configureStore(initialState: {}) {
  const store = createStore(
    rootReducer,
    initialState
  )
  createSagaMiddleware().run(sagas)

  return store
}
