import { take, put, call, fork } from 'redux-saga/effects'
import {
  AsyncStorage
} from 'react-native'
import * as api from '../services/api'
import { getCookies, setCookies } from '../services/request'
import { Action } from 'redux-actions'
import {
  IUserInfo
} from '../interfaces'
import {
  toastAction
} from '../actions'
import watchSearch from './search'
import watchComment from './comment'
import watchPlaylist from './playlist'

export function* loginFlow () {
  while (true) {
    const { payload = {
      username: '',
      password: ''
    } }: Action<IUserInfo> = yield take('user/login')
    const { username, password } = payload

    if (username && password) {
      yield put({
        type: 'user/login/start'
      })

      const userInfo = yield call(api.login, username.trim(), password.trim())

      yield put({
        type: 'user/login/end'
      })

      if (userInfo.code === 200) {
        yield put(toastAction('success', '您已成功登录'))
        yield AsyncStorage.setItem('Cookies', getCookies())
      } else {
        yield put(toastAction('warning', '帐号或密码错误'))
      }
    } else {
      yield put(toastAction('warning', '帐号或密码不能为空'))
    }
  }
}

export function* init() {
  while (true) {
    yield take('app/init')
    const Cookies: string = yield AsyncStorage.getItem('Cookies')

    if (Cookies && Cookies.includes(';')) {
      setCookies(Cookies)
      yield put({
        type: 'personal/playlist'
      })
    }
  }
}

export function* syncPersonnalPlaylist() {
  while (true) {
    yield take('personal/playlist')

    const userId = api.getUserId()

    if (userId) {
      const res = yield call(api.userPlayList)
      if (res.code === 200) {
        const playlists: api.IPlaylist[] = res.playlist
        let collect: api.IPlaylist[] = []
        let created: api.IPlaylist[] = []
        playlists.forEach(playlist => {
          if (playlist.creator.userId.toString() === userId) {
            created.push(playlist)
          } else {
            collect.push(playlist)
          }
        })
        yield put({
          type: 'personal/playlist/save',
          payload: {
            created,
            collect
          }
        })
      }
    }
  }
}

export default function* root () {
  yield [
    fork(init),
    fork(loginFlow),
    fork(watchPlaylist),
    fork(watchSearch),
    fork(watchComment),
    fork(syncPersonnalPlaylist)
  ]
}
