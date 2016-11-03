import { take, put, call, fork, select } from 'redux-saga/effects'
import {
  AsyncStorage
} from 'react-native'
import * as api from '../services/api'
import { getCookies } from '../services/request'
import { Action } from 'redux-actions'
import {
  IUserInfo,
  ISearchState
} from '../interfaces'
import {
  toastAction
} from '../actions'
import {
  syncMoreResource,
  syncSearchResource
} from './common'

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

export function* syncSearchPlaylists () {
  while (true) {
    yield *syncSearchResource(
      api.SearchType.playList,
      'search/playlist',
      'playlists',
      'coverImgUrl',
      (state: any) => state.search.playlist,
      (res: any) => res.result.playlists,
      (res: any) => res.result.playlistCount
    )
  }
}

const searchPageOrder = ['playlist', 'song', 'album', 'artist']

function* requestSearch () {
  const prevState = yield select(state => state.search)

  const key = searchPageOrder[prevState.activeTab]

  yield put({
    type: `search/${key}/query`
  })

  const { [key]: { query } }  = yield select(state => state.search)

  if (query && query !== prevState[key].query) {
    yield put({
      type: `search/${searchPageOrder[prevState.activeTab]}`
    })
  }
}

export function* searchQuerying () {
  while (true) {
    yield take('search/query')

    yield *requestSearch()
  }
}

export function* changeSearchActiveTab () {
  while (true) {
    yield take('search/activeTab')

    yield *requestSearch()
  }
}

export function* syncSearchSongs () {
  while (true) {
    yield *syncSearchResource(
      api.SearchType.song,
      'search/song',
      'songs',
      '',
      (state: any) => state.search.song,
      (res: any) => res.result.songs,
      (res: any) => res.result.songCount
    )
  }
}

export function* syncPlaylists () {
  while (true) {
    yield *syncMoreResource(
      'playlists/sync',
      'playlists',
      api.topPlayList,
      (state: any) => state.playlist,
      (result: any) => result.playlists
    )
    // yield take('playlists/sync')

    // yield put({
    //   type: 'playlists/sync/start'
    // })

    // const { more, offset, playlists }: IPlaylistsProps = yield select((state: any) => state.playlist)

    // if (more) {
    //   const offsetState = offset + 15
    //   const result: api.ItopPlayListResult = yield call(
    //     api.topPlayList, '15', offsetState.toString()
    //   )

    //   yield put({
    //     type: 'playlists/sync/save',
    //     payload: playlists.concat(result.playlists.map(p => {
    //       return Object.assign({}, p, {
    //         coverImgUrl: p.coverImgUrl + '?param=100y100'
    //       })
    //     })),
    //     meta: {
    //       more: result.more,
    //       offset: offsetState
    //     }
    //   })
    // } else {
    //   yield put(toastAction('info', '没有更多资源了'))
    // }

    // yield put({
    //   type: 'playlists/sync/end'
    // })
  }
}

export default function* root () {
  yield [
    fork(loginFlow),
    fork(syncPlaylists),
    fork(syncSearchPlaylists),
    fork(syncSearchSongs),
    fork(searchQuerying),
    fork(changeSearchActiveTab)
  ]
}
