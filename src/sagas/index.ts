import { take, put, call, fork } from 'redux-saga/effects'
import {
  Alert
} from 'react-native'
import * as Api from '../services/api'
import {
  Actions as Router
} from 'react-native-router-flux'
import {
  IFSA,
  IUserInfo
} from '../interfaces'

function* loginFlow () {
  while (true) {
    const action: IFSA<IUserInfo> = yield take('user/login')

    yield put({
      type: 'user/login/start'
    })

    const { username, password } = action.payload
    const userInfo = yield call(Api.login, username.trim(), password.trim())

    yield put({
      type: 'user/login/end'
    })

    if (userInfo.code === 200) {
      yield fork(Router.pop)
    } else {
      Alert.alert('错误', '错误的帐号或密码')
    }

  }
}

export default function* root() {
  yield fork(loginFlow)
}
