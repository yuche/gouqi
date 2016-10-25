import * as React from 'react'
import {
  Router,
  Scene
} from 'react-native-router-flux'
import Login from '../containers/login'
import Home from '../containers/home'
class NavRouter extends React.Component<any, any> {
  render() {
    return (
      <Router>
        <Scene key='root'>
          <Scene
            initial
            key='home'
            component={Home}
            title='home'
            hideNavBar={true}
          />

          <Scene
            key='login'
            component={Login}
            title='Login'
            hideNavBar={false}
          />
        </Scene>
      </Router>
    )
  }
}

export default NavRouter
