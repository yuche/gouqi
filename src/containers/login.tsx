import {
  assign
} from '../utils'
import * as api from '../services/api'
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

  componentDidMount() {
    api.newAlbums().then(e => console.log(e)).catch(e => console.log(e))

  }

  handleUsernameChange = (username: string)  => {
    this.setState(assign(this.state, { username }))
  }

  handlePasswordChange = (password: string) => {
    this.setState(assign(this.state, { password }))
  }

  render() {
    return (
      <View style={{margin: 128}}>
        <TextInput
          editable={true}
          style={{height: 40, borderColor: 'gray', borderWidth: 1}}
          onChangeText={this.handleUsernameChange}
        />
        <TextInput
          editable={true}
          style={{height: 40, borderColor: 'gray', borderWidth: 1}}
          onChangeText={this.handlePasswordChange}
        />
        <Text>登录</Text>
      </View>
    )
  }
}

export default Login
