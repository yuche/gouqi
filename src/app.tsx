import { Provider } from 'react-redux'
import * as React from 'react'
import Router from './routers/Router'
import configureStore from './store'

const store = configureStore({})

const App = () => (
  <Provider store={store}>
    <Router />
  </Provider>
)

export default App
