import * as React from 'react'
import {
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle
} from 'react-native'
import { connect } from 'react-redux'
import Router from '../routers'
import Icon  from '../components/icon'

class RecommendScene extends React.Component<any, any> {

  constructor(props: any) {
    super(props)
  }

  showToast = () => {
    // Router.toLogin()
    this.props.dispatch({
      type: 'ui/toast',
      payload: {
        kind: 'success',
        text: '',
        id: Math.random()
      }
    })
    // this.toast.warning('错误的帐号或密码')
    // this.refs.toast.show('fuck', 2000)
  }

  render () {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React wocao!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit index.ios.js
        </Text>
        <Text style={styles.instructions}>
          Press Cmd+R to reload,{'\n'}
          Cmd+D or shake for dev menu
        </Text>
        <Text onPress={() => Router.toCreatePlaylist()}>
          Go to Login Page
        </Text>
        <Text onPress={Router.toLogin()}>
          Go to fck Page
        </Text>
        <Icon name='comment' size={18}  color='black'/>
      </View>
    )
  }
}

export default connect()(RecommendScene)

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
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
