import * as React from 'react'
import {
  ScrollView,
  View,
  ViewStyle,
  TextInputStatic,
  TouchableOpacity,
  ActivityIndicator,
  Text
} from 'react-native'
import { connect, Dispatch } from 'react-redux'
import * as Actions from '../actions'
import {
  IUserInfo
} from '../interfaces'
import {
  Form
} from '../components/base'
import NavBar from '../components/navbar'
import { Color } from '../styles'

type IattemptLogin = (userInfo: IUserInfo) => Redux.Action

export interface IProps {
  isLoading: boolean,
  attemptLogin: IattemptLogin,
  title: string
}

class Login extends React.Component<IProps, IUserInfo> {
  private passwordInput: TextInputStatic
  constructor (props: IProps) {
    super(props)
    this.state = {
      username: '',
      password: ''
    }
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

  render () {
    const { username, password } = this.state
    const {
      isLoading
    } = this.props
    return (
      <View style={{flex: 1}}>
        <NavBar
          title={this.props.title}
          textColor='#333'
          hideBorder={false}
        />
        <ScrollView
          style={{marginTop: 10}}
          keyboardShouldPersistTaps='always'
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

          <TouchableOpacity
            onPress={!isLoading ? this.handleUserLogin : undefined}
            style={styles.btn}
          >
            {isLoading && <ActivityIndicator animating color='white' style={{ width: 15, height: 15 }}/>}
            <Text style={{ color: 'white' }}>
              登录
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    )
  }
}

const styles = {
  btn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    height: 40,
    backgroundColor: Color.main,
    margin: 10
  } as ViewStyle
}

export default connect(
  (state: any) => ({ isLoading: state.login.isLoading}),
  (dispatch: Dispatch<Redux.Action>) => ({
    attemptLogin (userInfo: IUserInfo) {
      return dispatch(Actions.userLogin(userInfo))
    }
  })
)(Login)
