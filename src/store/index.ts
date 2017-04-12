import {
  createStore,
  applyMiddleware,
  compose
} from 'redux'
import rootReducer from '../reducers'
import createSagaMiddleware from 'redux-saga'
import sagas from '../sagas'
import { Platform } from 'react-native'

let composeEnhancers = compose
declare const __DEV__: boolean

if (__DEV__) {
  // tslint:disable-next-line:no-var-requires
  const { composeWithDevTools } = require('remote-redux-devtools')
  const config = {
      // realtime: true,
      name: Platform.OS,
      hostname: 'localhost',
      actionsBlacklist: ['player/currentTime', '🐸🐸🐸', 'download/progress'],
      port: 5678
  }

  composeEnhancers = composeWithDevTools(config)
}

const sagaMiddleware = createSagaMiddleware()

const enhancer = composeEnhancers(
  applyMiddleware(sagaMiddleware)
)

export default function configureStore(initialState: any) {
  const store = createStore(
    rootReducer,
    initialState,
    enhancer
  )
  sagaMiddleware.run(sagas)
  return store
}
