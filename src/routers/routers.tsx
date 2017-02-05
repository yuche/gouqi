import * as React from 'react'

import {Scene, Router} from 'react-native-router-flux'
import Home from '../containers/home'
import Login from '../containers/login'
import Search from '../containers/search'

const Routers = () => (
  <Router>
    <Scene key='root'>
      <Scene key='home' component={Home} hideNavBar initial/>
      <Scene key='login' component={Login} title='登录' />
      <Scene key='search' component={Search} direction='vertical' hideNavBar/>
    </Scene>
  </Router>
)

export default Routers
