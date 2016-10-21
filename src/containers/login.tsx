import { assign } from '../utils'
import * as React from 'react'
import {
  Text,
  TextInput,
  View
} from 'react-native'
import { connect, Dispatch } from 'react-redux'
import * as Actions from '../actions'
import {
  IUserInfo
} from '../interfaces'
import * as api from '../services/api'
export interface IattemptLogin {
  (userInfo: IUserInfo): Redux.Action
}

export interface IProps {
  isLoading: boolean,
  attemptLogin: IattemptLogin
}

class Login extends React.Component<IProps, IUserInfo> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      username: '',
      password: ''
    }
  }

  componentDidMount() {
    api.topPlayList().then(res => console.log(res))
  }

  handleUsernameChange = (username: string)  => {
    this.setState(assign(this.state, { username }))
  }

  handlePasswordChange = (password: string) => {
    this.setState(assign(this.state, { password }))
  }

  handleUserLogin = () => {
    this.props.attemptLogin(this.state)
  }

  onLoadStart(e: any) {
    console.log(e)
    console.log('load start')
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

        <Text
          onPress={this.handleUserLogin}
        >
          登录fuckfuck
        </Text>
      </View>
    )
  }
}

export default connect(
  (state: any) => ({ isLoading: state.login.isLoading}),
  (dispatch: Dispatch<Redux.Action>) => ({
    attemptLogin(userInfo: IUserInfo) {
      return dispatch(Actions.userLogin(userInfo))
    }
  })
)(Login)
