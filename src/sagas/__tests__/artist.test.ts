import {
  syncArtistTracks,
  syncArtistAlbums,
  syncArtistDescription,
  toggleSubscribeArtist,
  detailSelector,
  favorites,
  refreshArtists,
  syncMoreArtists
} from '../artist'
import mainSaga from '../artist'
import { testSaga } from 'redux-saga-test-plan'
import { delay } from 'redux-saga'
import { InteractionManager } from 'react-native'
import * as api from '../../services/api'
import { takeLatest, takeEvery } from 'redux-saga/effects'

test('syncArtistTracks', () => {
  const payload = 1
  testSaga(syncArtistTracks, { payload })
    .next()
    .call(delay, 100)
    .next()
    .put({
      type: 'artists/detail/track/start'
    })
    .next()
    .save('ajax')
    .next({ code: 200, hotSongs: [], artist: [] })
    .call(InteractionManager.runAfterInteractions)
    .next()
    .put({
      type: 'artists/detail/track/save',
      payload: {
        tracks: [],
        artist: []
      },
      meta: payload
    })
    .next()
    .restore('ajax')
    .next({ code: 404 })
    .call(InteractionManager.runAfterInteractions)
    .next()
    .put({
      type: 'artists/detail/track/end'
    })
    .next()
    .isDone()
})

test('syncArtistAlbums', () => {
  const payload = 1
  testSaga(syncArtistAlbums, { payload })
    .next()
    .put({
      type: 'artists/detail/album/start'
    })
    .next()
    .save('ajax')
    .next({ code: 200, hotAlbums: [] })
    .call(InteractionManager.runAfterInteractions)
    .next()
    .put({
      type: 'artists/detail/album/save',
      payload: [],
      meta: payload
    })
    .next()
    .restore('ajax')
    .next({code: 404})
    .call(InteractionManager.runAfterInteractions)
    .next()
    .put({
      type: 'artists/detail/album/end'
    })
    .next()
    .isDone()
})

test('syncArtistDescription', () => {
  const payload = 1
  testSaga(syncArtistDescription, { payload })
    .next()
    .put({
      type: 'artists/detail/description/start'
    })
    .next()
    .save('ajax')
    .next({
      code: 200,
      briefDesc: [],
      introduction: []
    })
    .call(InteractionManager.runAfterInteractions)
    .next()
    .put({
      type: 'artists/detail/description/save',
      payload: {
        brief: [],
        introduction: []
      },
      meta: payload
    })
    .next()
    .restore('ajax')
    .next({code: 404})
    .call(InteractionManager.runAfterInteractions)
    .next()
    .put({
      type: 'artists/detail/description/end'
    })
    .next()
    .isDone()
})

test('SubscribeArtist', () => {
  const payload = 1
  testSaga(toggleSubscribeArtist, {payload})
    .next()
    .select(detailSelector)
    .next({ 1: { artist: {followed: true} } })
    .put({
      type: 'artists/detail/follow/start'
    })
    .next()
    .call(api.unsubscribeArtist, payload.toString())
    .next({code: 200})
    .put({
      type: 'artists/detail/follow/toggle',
      payload: false,
      meta: payload
    })
    .next()
    .put({
      type: 'artists/detail/follow/end'
    })
    .next()
    .isDone()
})

test('unSubscribeArtist', () => {
  const payload = 1
  testSaga(toggleSubscribeArtist, { payload })
    .next()
    .select(detailSelector)
    .next({ 1: { artist: { followed: false } } })
    .put({
      type: 'artists/detail/follow/start'
    })
    .next()
    .call(api.subscribeArtist, payload.toString())
    .next({ code: 404 })
    .put({
      type: 'artists/detail/follow/end'
    })
    .next()
    .isDone()
})

test('detailSelector', () => {
  expect(detailSelector({ artist: { detail: [] } })).toEqual([])
})

test('favorites', () => {
  testSaga(favorites)
    .next()
    .put({
      type: 'artists/favo/start'
    })
    .next()
    .call(api.favoriteArtists)
    .save('ajax')
    .next({ code: 200, data: [] })
    .put({
      type: 'artists/favo/save',
      payload: []
    })
    .next()
    .restore('ajax')
    .next({code: 404})
    .put({
      type: 'artists/favo/end'
    })
    .next()
    .isDone()
})

test('mainSaga', () => {
  testSaga(mainSaga)
    .next()
    .all([
      takeLatest('artists/refresh', refreshArtists),
      takeLatest('artists/sync', syncMoreArtists),
      takeLatest('artists/detail/follow', toggleSubscribeArtist),
      takeLatest('artists/favo', favorites),
      takeEvery('artists/detail/track', syncArtistTracks),
      takeEvery('artists/detail/album', syncArtistAlbums),
      takeEvery('artists/detail/description', syncArtistDescription)
    ])
    .next()
    .isDone()
})
