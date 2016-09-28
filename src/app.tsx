import { Provider } from 'react-redux'
import * as React from 'react'
import NavRouter from './routers'
import configureStore from './store'

const store = configureStore({})

export default class Gouqi extends React.Component<any, any> {
  render() {
    return (
      <Provider store={store}>
        <NavRouter />
      </Provider>
    )
  }
}
