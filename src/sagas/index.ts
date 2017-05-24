import { take, put, call, fork, all, takeLatest } from 'redux-saga/effects'
import {
  AsyncStorage,
  InteractionManager
} from 'react-native'
import * as api from '../services/api'
import { getCookies, setCookies } from '../services/request'
import { Action } from 'redux-actions'
import {
  IUserInfo
} from '../interfaces'
import {
  toastAction,
  addSecondsAction
} from '../actions'
import watchSearch from './search'
import watchComment from './comment'
import watchPlaylist from './playlist'
import watchPlayer from './player'
import watchDownload from './download'
import watchPersonal from './personal'
import watchAlbums from './album'
import Router from '../routers'
import watchRecommend from './recommend'
import watchArtist from './artist'
import * as RNFS from 'react-native-fs'
import { getDownloadedTracks, FILES_FOLDER } from '../utils'

export const COOKIES = 'Cookies'

export function* setProfile (profile) {
  yield call(AsyncStorage.setItem, 'PROFILE', JSON.stringify(profile))
  yield call(AsyncStorage.setItem, COOKIES, getCookies())
  yield put({
    type: 'personal/profile',
    payload: profile
  })
}

export function* getProfile () {
  const profile = yield call(AsyncStorage.getItem, 'PROFILE')
  yield put({
    type: 'personal/profile',
    payload: JSON.parse(profile)
  })
}

export function* loginFlow ({ payload }: any) {
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
      yield call(Router.pop)
      yield call(InteractionManager.runAfterInteractions)
      yield put(toastAction('success', '你已成功登录'))
      yield fork(setProfile, userInfo.profile)
    } else {
      yield put(toastAction('warning', '帐号或密码错误'))
    }
  } else {
    yield put(toastAction('warning', '帐号或密码不能为空'))
  }
}

export function* setCookiesSaga () {
  const Cookies: string = yield call(AsyncStorage.getItem, COOKIES)

  if (Cookies && typeof Cookies === 'string' && Cookies.includes(';')) {
    const expires = Cookies.split(';').find((c) => c.includes('Expires'))
    if (expires) {
      if (new Date(expires) > new Date()) {
        setCookies(Cookies)
        yield put({
          type: 'personal/playlist'
        })
      } else {
        yield put(toastAction('info', '登录凭证已过期'))
        yield call(Router.toLogin)
      }
    }
  }
}

export function* setDownloadTracksSaga () {
  const tracks = yield call(getDownloadedTracks)
  yield put({
    type: 'download/tracks/set',
    payload: tracks
  })
  yield call(RNFS.mkdir, FILES_FOLDER)
}

export function* setSecondsSaga () {
  const seconds = yield call(AsyncStorage.getItem, 'SECONDS')
  yield put(addSecondsAction(Number(seconds)))
}

export function* getHistory () {
  const historys = yield call(AsyncStorage.getItem, 'HISTORY')
  yield put({
    type: 'player/history/save',
    payload: historys ? JSON.parse(historys) : []
  })
}

export function* init () {
  // while (true) {
    yield take('app/init')

    yield call(setCookiesSaga)

    yield call(setDownloadTracksSaga)

    yield call(setSecondsSaga)

    yield call(getProfile)

    yield call(getHistory)

    yield put({
      type: 'home/recommend'
    })
  // }
}

export default function* root () {
  yield all([
    fork(init),
    takeLatest('user/login', loginFlow),
    fork(watchPlaylist),
    fork(watchSearch),
    fork(watchComment),
    fork(watchPlayer),
    fork(watchDownload),
    fork(watchPersonal),
    fork(watchRecommend),
    fork(watchAlbums),
    fork(watchArtist)
  ])
}
