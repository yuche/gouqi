import { Provider } from 'react-redux'
import * as React from 'react'
import configureStore from './store'
import Routers from './routers/routers'

const store = configureStore({})

const App = () => (
  <Provider store={store}>
    <Routers />
  </Provider>
)
export default App
