import { Provider } from 'react-redux'
import * as React from 'react'
import Navigation from './containers/Navigation'
import configureStore from './store'

const store = configureStore({})

const App = () => (
  <Provider store={store}>
    <Navigation />
  </Provider>
)

export default App
