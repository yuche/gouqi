import {
  assign
} from '../utils'
import * as React from 'react'
import {
  Text,
  TextInput,
  View
} from 'react-native'
import { connect } from 'react-redux'

export interface IState {
  username: string,
  password: string
}

export interface IProps {
  isLoading: boolean
}

class Login extends React.Component<{isLoading: boolean}, IState> {
  constructor(props: {isLoading: boolean}) {
    super(props)
    this.state = {
      username: '',
      password: ''
    }
  }

  componentDidMount() {
    console.log(this.props)
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

export default connect(
  (state: any) => ({ isLoading: state.login.isLoading})
)(Login)
