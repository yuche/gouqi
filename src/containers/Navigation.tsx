import * as React from 'react'
import {
  Navigator,
  View,
  Text
} from 'react-native'
import Home from './home'
import ToastContainer from './toastContainer'
import Router from '../routers'


const initialRoute: React.Route = {
  component: Home,
  title: 'home',
  index: 0
}



class Navigation extends React.Component<any, any> {
  private router: Router

  constructor(props: any) {
    super(props)
  }

  render () {
    return <View style={{flex: 1}}>
        <Navigator
          initialRoute={initialRoute}
          configureScene={this.configureScene}
          renderScene={this.renderScene}
        />
        <ToastContainer />
    </View>
  }

  private configureScene = ({
    sceneConfig = Navigator.SceneConfigs.PushFromRight
  }: React.Route) => {
    return sceneConfig
  }

  private renderScene = ({
    component,
    title,
    index,
    id,
    passProps
  }: React.Route, navigator: React.NavigatorStatic) => {
    this.router = this.router || new Router(navigator)
    if (component) {
      const Component: React.ComponentClass<any> = component
      return <Component
        {...passProps}
        route={{title, index, id}}
        router={this.router}
      />
    }
    return <View>
      <Text>404</Text>
    </View>
  }
}

export default Navigation
