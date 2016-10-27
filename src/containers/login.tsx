import * as React from 'react'
import {
  Text,
  TextInput,
  ScrollView,
  View,
  TextInputStatic
} from 'react-native'
import { connect, Dispatch } from 'react-redux'
import * as Actions from '../actions'
import {
  IUserInfo,
  IRouterProps
} from '../interfaces'
import {
  Form,
  Button
} from '../components/base'
import NavBar from '../components/navbar'

export interface IattemptLogin {
  (userInfo: IUserInfo): Redux.Action
}

export interface IProps extends IRouterProps {
  isLoading: boolean,
  attemptLogin: IattemptLogin
}

class Login extends React.Component<IProps, IUserInfo> {
  private passwordInput: TextInputStatic
  constructor(props: IProps) {
    super(props)
    this.state = {
      username: '',
      password: ''
    }
    console.log(props)
  }

  handleUsernameChange = (username: string)  => {
    this.setState({ username } as IUserInfo)
  }

  handlePasswordChange = (password: string) => {
    this.setState({ password } as IUserInfo)
  }

  handleUserLogin = () => {
    this.props.attemptLogin(this.state)
  }

  userOnClear = () => {
    this.setState({ username: '' } as IUserInfo)
  }

  passwordOnClear = () => {
    this.setState({ password: '' } as IUserInfo)
  }

  userInputOnSumit = () => {
    this.passwordInput.focus()
  }

  mapPasswordInput = (ref: TextInputStatic) => {
    this.passwordInput = ref
  }

  render() {
    const { username, password } = this.state
    const { route, router } = this.props
    return (
      <NavBar route={route} router={router}>
        <ScrollView
          style={{marginTop: 10}}
          keyboardShouldPersistTaps={true}
        >
          <Form
            icon='user'
            autoFocus={true}
            editable={true}
            placeholder='手机号码或邮箱'
            onChangeText={this.handleUsernameChange}
            value={username}
            onClear={this.userOnClear}
            onSubmitEditing={this.userInputOnSumit}
          />

          <Form
            inputRef={this.mapPasswordInput}
            icon='key'
            secureTextEntry={true}
            editable={true}
            placeholder='密码'
            onClear={this.passwordOnClear}
            onChangeText={this.handlePasswordChange}
            value={password}
            onSubmitEditing={this.handleUserLogin}
          />

          <Button
            onPress={this.userOnClear}
            disabled={!username || !password}
          >
            登录
          </Button>
        </ScrollView>
      </NavBar>
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
