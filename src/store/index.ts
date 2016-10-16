import {
  createStore,
  applyMiddleware
} from 'redux'
import rootReducer from '../reducers'
import createSagaMiddleware from 'redux-saga'
import sagas from '../sagas'
const createLogger = require('redux-logger')


export default function configureStore(initialState: any) {
  const sagaMiddleware = createSagaMiddleware()
  const logger = createLogger()
  const store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(sagaMiddleware, logger)
  )
  sagaMiddleware.run(sagas)
  return store
}
