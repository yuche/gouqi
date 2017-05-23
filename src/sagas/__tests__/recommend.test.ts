import { testSaga } from 'redux-saga-test-plan'
import * as actions from '../../actions'
import mainSaga from '../recommend'
import {
  recommendSaga,
  artistsOffsetSelector,
  syncMoreAlbums,
  syncMoreArtists,
  albumsOffsetSelector
} from '../recommend'
import { takeLatest } from 'redux-saga/effects'
import { InteractionManager } from 'react-native'
import * as api from '../../services/api'

const state = {
  home: {
    albumsOffset: 100,
    artistsOffset: 100
  }
}

describe('selector', () => {
  test('artistsOffsetSelector', () => {
    expect(artistsOffsetSelector(state)).toEqual(100)
  })

  test('albumsOffsetSelector', () => {
    expect(albumsOffsetSelector(state)).toEqual(100)
  })
})

test('main saga', () => {
  testSaga(mainSaga)
    .next()
    .all([
      takeLatest('home/recommend', recommendSaga),
      takeLatest('home/albums', syncMoreAlbums),
      takeLatest('home/artists', syncMoreArtists)
    ])
    .next()
    .isDone()
})

describe('syncMoreAlbums', () => {
  test('ajax success', () => {
    testSaga(syncMoreAlbums)
      .next()
      .select(albumsOffsetSelector)
      .next(albumsOffsetSelector(state))
      .put({
        type: 'home/recommend/start'
      })
      .next()
      .save('ajax')
      .next({
        code: 200,
        albums: [],
        total: 200
      })
      .put({
        type: 'home/albums/save',
        payload: [],
        meta: 130
      })
      .next()
      .restore('ajax')
      .next({
        code: 200,
        total: 0
      })
      .put(actions.toastAction('info', '所有内容已经加载完毕。'))
      .next()
      .put({
        type: 'home/recommend/end'
      })
      .next()
      .isDone()
  })

  test('ajax failed', () => {
    testSaga(syncMoreAlbums)
      .next()
      .select(albumsOffsetSelector)
      .next(albumsOffsetSelector(state))
      .put({
        type: 'home/recommend/start'
      })
      .next()
      .next({ code: 404 })
      .put({
        type: 'home/recommend/end'
      })
      .next()
      .isDone()
  })
})

describe('syncMoreArtists', () => {
  test('ajax success', () => {
    testSaga(syncMoreArtists)
      .next()
      .select(artistsOffsetSelector)
      .next(artistsOffsetSelector(state))
      .put({
        type: 'home/recommend/start'
      })
      .next()
      .save('ajax')
      .next({
        code: 200,
        albums: [],
        more: true
      })
      .put({
        type: 'home/artists/save',
        payload: [],
        meta: 130
      })
      .next()
      .restore('ajax')
      .next({
        code: 200,
        albums: [],
        more: false
      })
      .put(actions.toastAction('info', '所有内容已经加载完毕。'))
      .next()
      .put({
        type: 'home/recommend/end'
      })
      .next()
      .isDone()
  })

  test('ajax failed', () => {
    testSaga(syncMoreArtists)
      .next()
      .select(artistsOffsetSelector)
      .next(artistsOffsetSelector(state))
      .put({
        type: 'home/recommend/start'
      })
      .next()
      .next({ code: 404 })
      .put({
        type: 'home/recommend/end'
      })
      .next()
      .isDone()
  })
})

describe('recommendSaga', () => {
  const promises = [
    api.topPlayList('30'),
    api.newAlbums('30'),
    api.topArtists('30')
  ]

  const response = {
    code: 200,
    playlists: [],
    albums: [],
    artists: [],
    recommend: []
  }

  test('not login', () => {
    testSaga(recommendSaga)
      .next()
      .call(api.getUserId)
      .next(false)
      .put({
        type: 'home/recommend/start'
      })
      .next()
      .call(Promise.all, promises)
      .next([response, response, response])
      .put({
        type: 'playlists/sync/save',
        payload: [],
        meta: {
          more: true,
          offset: 0
        }
      })
      .next()
      .put({
        type: 'home/recommend/save',
        payload: {
          albums: [],
          artists: []
        }
      })
      .next()
      .put({
        type: 'home/recommend/end'
      })
      .next()
      .isDone()
  })

  test('login', () => {
    testSaga(recommendSaga)
      .next()
      .call(api.getUserId)
      .next(true)
      .put({
        type: 'home/recommend/start'
      })
      .next()
      .call(Promise.all, [...promises, api.dailyRecommend('30')])
      .next([response, response, response, response])
      .put({
        type: 'playlists/sync/save',
        payload: [],
        meta: {
          more: true,
          offset: 0
        }
      })
      .next()
      .put({
        type: 'home/recommend/save',
        payload: {
          albums: [],
          artists: []
        }
      })
      .next()
      .put({
        type: 'personal/daily/save',
        payload: []
      })
      .next()
      .put({
        type: 'home/recommend/end'
      })
      .next()
      .isDone()
  })

  test('throw error', () => {
    const error = new Error('err')
    testSaga(recommendSaga)
      .next()
      .call(api.getUserId)
      .next(false)
      .put({
        type: 'home/recommend/start'
      })
      .next()
      .call(Promise.all, promises)
      .next([{ code: 404 }, { code: 404 }, { code: 404 }])
      .back()
      .throw(error)
      .put(actions.toastAction('error', '网络出现错误..'))
      .next()
      .put({
        type: 'home/recommend/end'
      })
      .next()
      .isDone()
  })
})
