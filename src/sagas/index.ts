import { take, put, call, fork } from 'redux-saga/effects'
import * as Api from '../services/api'

function* loginFlow () {
  while (true) {
    const action = yield take('/user/login')

    yield put({
      'type': 'user/login/start'
    })

    const { username, password } = action.payload
    const userInfo = yield call(Api.login, username, password)
    console.log(userInfo)

    if (userInfo.code === 200) {
      console.log('success')
    } else {
      console.log('fail')
    }

    yield put({
      type: 'user/login/end'
    })
  }
}

export default function* root() {
  yield fork(loginFlow)
}
