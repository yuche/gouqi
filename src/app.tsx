import { Provider } from 'react-redux'
import * as React from 'react'
import Navigation from './containers/Navigation'
import configureStore from './store'
import {Scene, Router} from 'react-native-router-flux'
import Home from './containers/home'
import Login from './containers/login'
import Search from './containers/search'

const store = configureStore({})

const App = () => (
  <Provider store={store}>
    <Navigation />
  </Provider>
)

const AppRouter = () => (
  <Provider store={store}>
    <Router>
      <Scene key='root'>
        <Scene key='home' component={Home} hideNavBar/>
        <Scene key='login' component={Login} title='登录' hideNavBar/>
        <Scene key='search' component={Search} hideNavBar/>
      </Scene>
    </Router>
  </Provider>
)

export default AppRouter
