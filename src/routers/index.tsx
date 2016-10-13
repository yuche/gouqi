import * as React from 'react'
import {
  Router,
  Scene
} from 'react-native-router-flux'
import Login from '../containers/login'
import RecommendScene from '../containers/recommend'
import PlayList from '../containers/playlist'

class NavRouter extends React.Component<any, any> {
  render() {
    return (
      <Router>
        <Scene key='root'>
          <Scene
            initial
            key='recommendScene'
            component={RecommendScene}
            title='Recommended'
          />

          <Scene
            key='login'
            component={Login}
            title='Login'
          />

          <Scene
            key='playlist'
            component={PlayList}
            title='playlist'
          />
        </Scene>
      </Router>
    )
  }
}

export default NavRouter
