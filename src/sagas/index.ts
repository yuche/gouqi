import { apply, take, put, call, fork, select } from 'redux-saga/effects'
import {
  Alert,
  AsyncStorage
} from 'react-native'
import * as api from '../services/api'
import { getCookies } from '../services/request'
import {
  Actions as Router
} from 'react-native-router-flux'
import {
  IFSA,
  IUserInfo,
  IPlaylistsProps
} from '../interfaces'
import {
  assign
} from '../utils'

function* fetchSagas (apiFn: any, ...args: any[]) {
  yield put({
    type: 'ui/fetch/start'
  })
  yield call(apiFn, args)
}

export function* loginFlow () {
  while (true) {
    const action: IFSA<IUserInfo> = yield take('user/login')

    yield put({
      type: 'user/login/start'
    })

    const { username, password } = action.payload
    const userInfo = yield call(api.login, username.trim(), password.trim())

    yield put({
      type: 'user/login/end'
    })

    if (userInfo.code === 200) {
      yield AsyncStorage.setItem('Cookies', getCookies())
      Router.pop()
    } else {
      Alert.alert('错误', '错误的帐号或密码')
    }

  }
}

export function* syncPlaylists () {
  while (true) {
    yield take('playlists/sync')

    yield put({
      type: 'playlists/sync/start'
    })

    const { more, offset, playlists }: IPlaylistsProps = yield select((state: any) => state.playlist)

    if (more) {
      const offsetState = offset + 15
      const result: api.ItopPlayListResult = yield call(
        api.topPlayList, '15', offsetState.toString()
      )

      yield put({
        type: 'playlists/sync/save',
        payload: playlists.concat(result.playlists.map(p => {
          return Object.assign({}, p, {
            coverImgUrl: p.coverImgUrl + '?param=100y100'
          })
        })),
        meta: {
          more: result.more,
          offset: offsetState
        }
      })
    }

    yield put({
      type: 'playlists/sync/end'
    })
  }
}

export default function* root() {
  yield [
    fork(loginFlow),
    fork(syncPlaylists)
  ]
}
