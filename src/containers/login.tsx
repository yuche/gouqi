import * as React from 'react'
import {
  Text,
  TextInput,
  View
} from 'react-native'

interface IState {
  username: string,
  password: string
}

class Login extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = {
      username: '',
      password: ''
    }
  }

  handleUsernameChange(text: string) {
    this.setState({username: text})
  }

  handlePasswordChange(text: string) {
    this.setState({password: text})
  }

  render() {
    return (
      <View style={{padding: 10}}>
        <TextInput
          onChangeText={this.handleUsernameChange}
        />
        <TextInput
          onChangeText={this.handlePasswordChange}
        />
        <Text>登录</Text>
      </View>
    )
  }
}

export default Login
