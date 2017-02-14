import {
  createStore,
  applyMiddleware
} from 'redux'
import rootReducer from '../reducers'
import createSagaMiddleware from 'redux-saga'
import sagas from '../sagas'
// tslint:disable-next-line:no-var-requires


export default function configureStore(initialState: any) {
  const sagaMiddleware = createSagaMiddleware()
  const store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(sagaMiddleware)
  )
  sagaMiddleware.run(sagas)
  return store
}
