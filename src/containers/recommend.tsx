import * as React from 'react'
import {
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle
} from 'react-native'
import { Actions as router } from 'react-native-router-flux'

import Toast from '../components/toast'


export default class RecommendScene extends React.Component<any, any> {

  refs: {
    toast: Toast
  }

  showToast = () => {
    this.refs.toast.warning('错误的帐号或密码')
    // this.refs.toast.show('fuck', 2000)
  }

  render () {
    return (
      <View style={styles.container}>
        <Toast ref='toast'/>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit index.ios.js
        </Text>
        <Text style={styles.instructions}>
          Press Cmd+R to reload,{'\n'}
          Cmd+D or shake for dev menu
        </Text>
        <Text onPress={router.login}>
          Go to Login Page
        </Text>
        <Text onPress={this.showToast}>
          Go to fck Page
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    flex: 1,
    justifyContent: 'center'
  } as ViewStyle,
  instructions: {
    color: '#333333',
    marginBottom: 5,
    textAlign: 'center'
  } as TextStyle,
  welcome: {
    fontSize: 20,
    margin: 10,
    textAlign: 'center'
  } as TextStyle
})
