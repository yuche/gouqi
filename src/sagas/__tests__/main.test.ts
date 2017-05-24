import watchSearch from '../search'
import watchComment from '../comment'
import watchPlaylist from '../playlist'
import watchPlayer from '../player'
import watchDownload from '../download'
import watchPersonal from '../personal'
import watchAlbums from '../album'
import Router from '../../routers'
import watchRecommend from '../recommend'
import watchArtist from '../artist'
import * as RNFS from 'react-native-fs'
import mainSaga from '../index'
import {
  init,
  loginFlow,
  getHistory,
  setCookiesSaga,
  setDownloadTracksSaga,
  getProfile,
  setSecondsSaga,
  setProfile,
  COOKIES
 } from '../index'
import { takeLatest, fork } from 'redux-saga/effects'
import { END } from 'redux-saga'
import { testSaga } from 'redux-saga-test-plan'
import * as actions from '../../actions'
import * as api from '../../services/api'
import { AsyncStorage, InteractionManager } from 'react-native'
import { getDownloadedTracks, FILES_FOLDER } from '../../utils'
import { ajaxCall } from '../common'

test('mainSaga', () => {
  testSaga(mainSaga)
    .next()
    .all([
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
    .next()
    .isDone()
})

describe('ajaxCall', () => {
  test('no login', () => {
    const error = new Error('未登录')
    const response = { error }
    testSaga(ajaxCall, isNaN, 1024)
      .next()
      .call(isNaN, 1024)
      .next(response)
      .call(Router.toLogin)
      .next()
      .put(END)
      .next()
      .returns(response)
      .next()
      .isDone()
  })

  test('network error', () => {
    const error = new Error('network error')
    const response = { error }
    testSaga(ajaxCall, isNaN, 1024)
      .next()
      .call(isNaN, 1024)
      .next(response)
      .put(actions.toastAction('error', '网络出现错误...'))
      .next()
      .put(END)
      .next()
      .returns(response)
      .next()
      .isDone()
  })
})

test('init', () => {
  testSaga(init)
    .next()
    .take('app/init')
    .next()
    .call(setCookiesSaga)
    .next()
    .call(setDownloadTracksSaga)
    .next()
    .call(setSecondsSaga)
    .next()
    .call(getProfile)
    .next()
    .call(getHistory)
    .next()
    .put({
      type: 'home/recommend'
    })
    .next()
    .isDone()
})

const profile = { name: 'wallace' }

test('setProfile', () => {
  testSaga(setProfile, profile)
    .next()
    .call(AsyncStorage.setItem, 'PROFILE', JSON.stringify(profile))
    .next()
    .call(AsyncStorage.setItem, 'Cookies', '')
    .next()
    .put({
      type: 'personal/profile',
      payload: profile
    })
    .next()
    .isDone()
})

test('getProfile', () => {
  const profileStr = JSON.stringify(profile)
  testSaga(getProfile)
    .next()
    .call(AsyncStorage.getItem, 'PROFILE')
    .next(profileStr)
    .put({
      type: 'personal/profile',
      payload: JSON.parse(profileStr)
    })
    .next()
    .isDone()
})

describe('login flow', () => {
  const info = {
    username: 'older',
    password: 'excited'
  }
  test('empty user or pwd', () => {
    testSaga(loginFlow, { payload: { username: '', password: '' } })
      .next()
      .put(actions.toastAction('warning', '帐号或密码不能为空'))
      .next()
      .isDone()
  })

  test('can login', () => {
    testSaga(loginFlow, { payload: info })
      .next()
      .put({
        type: 'user/login/start'
      })
      .next()
      .call(api.login, info.username, info.password)
      .next({ code: 200, profile: info })
      .put({
        type: 'user/login/end'
      })
      .next()
      .call(Router.pop)
      .next()
      .call(InteractionManager.runAfterInteractions)
      .next()
      .put(actions.toastAction('success', '你已成功登录'))
      .next()
      .fork(setProfile, info)
      .next()
      .isDone()
  })

  test('wrong password', () => {
    testSaga(loginFlow, { payload: info })
      .next()
      .put({
        type: 'user/login/start'
      })
      .next()
      .call(api.login, info.username, info.password)
      .next({ code: 502})
      .put({
        type: 'user/login/end'
      })
      .next()
      .put(actions.toastAction('warning', '帐号或密码错误'))
      .next()
      .isDone()
  })
})

test('setDownloadTracksSaga', () => {
  testSaga(setDownloadTracksSaga)
    .next()
    .call(getDownloadedTracks)
    .next([])
    .put({
      type: 'download/tracks/set',
      payload: []
    })
    .next()
    .call(RNFS.mkdir, FILES_FOLDER)
    .next()
    .isDone()
})

test('setSecondsSaga', () => {
  testSaga(setSecondsSaga)
    .next()
    .call(AsyncStorage.getItem, 'SECONDS')
    .next(110)
    .put(actions.addSecondsAction(110))
    .next()
    .isDone()
})

test('getHistory', () => {
  testSaga(getHistory)
    .next()
    .call(AsyncStorage.getItem, 'HISTORY')
    .next(110)
    .put({
      type: 'player/history/save',
      payload: 110
    })
    .next()
    .restart()
    .next()
    .call(AsyncStorage.getItem, 'HISTORY')
    .next(undefined)
    .put({
      type: 'player/history/save',
      payload: []
    })
    .next()
    .isDone()
})

describe('setCookiesSaga', () => {
  const Cookies = 'smile windy talk=Wallace; Expires='

  test('token is expired', () => {
    const date = '1989-06-04'
    testSaga(setCookiesSaga)
      .next()
      .call(AsyncStorage.getItem, COOKIES)
      .next(Cookies + date)
      .put(actions.toastAction('info', '登录凭证已过期'))
      .next()
      .call(Router.toLogin)
      .next()
      .isDone()
  })

  test('cookies not includes *Expires* key', () => {
    testSaga(setCookiesSaga)
      .next()
      .call(AsyncStorage.getItem, COOKIES)
      .next('reporter=fast;wallace=tall')
      .isDone()
  })

  test('can set cookies', () => {
    const date = '2048-10-24'
    testSaga(setCookiesSaga)
      .next()
      .call(AsyncStorage.getItem, COOKIES)
      .next(Cookies + date)
      .put({
        type: 'personal/playlist'
      })
      .next()
      .isDone()
  })

  test('no cookies at all', () => {
    testSaga(setCookiesSaga)
      .next()
      .call(AsyncStorage.getItem, 'Cookies')
      .next(null)
      .isDone()
  })
})
