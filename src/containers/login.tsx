import {
  assign
} from '../utils'
import * as React from 'react'
import {
  Text,
  TextInput,
  View
} from 'react-native'

export interface IState {
  username: string,
  password: string
}

class Login extends React.Component<{}, IState> {
  constructor(props: {}) {
    super(props)
    this.state = {
      username: '',
      password: ''
    }
  }

  handleUsernameChange(username: string) {
    this.setState(assign(this.state, { username }))
  }

  handlePasswordChange(password: string) {
    this.setState(assign(this.state, { password }))
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
