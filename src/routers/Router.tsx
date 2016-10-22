import * as React from 'react'
import {
  Navigator,
  View,
  Text
} from 'react-native'
import Home from '../containers/home'
import ToastContainer from '../containers/toastContainer'

const initialRoute: React.Route = {
  component: Home,
  name: 'home',
  index: 0
}



class Router extends React.Component<any, any> {

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
    sceneConfig = Navigator.SceneConfigs.FloatFromRight
  }: React.Route) => {
    return sceneConfig
  }

  private renderScene = ({
    component,
    name,
    index,
    props
  }: React.Route) => {
    if (component) {
      const Component: React.ComponentClass<any> = component
      return <Component
        {...props}
        route={{name, index}}
      />
    }
    return <View>
      <Text>404</Text>
    </View>
  }
}

export default Router
