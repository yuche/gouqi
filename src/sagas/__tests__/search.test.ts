import { testSaga } from 'redux-saga-test-plan'
import * as actions from '../../actions'
import * as api from '../../services/api'
import mainSaga from '../search'
import {
  requestSearch,
  syncSearchSongs,
  syncSearchPlaylists,
  syncSearchArtist,
  syncSearchAlbums,
  searchPageOrder
} from '../search'
import { takeEvery, fork } from 'redux-saga/effects'
import { searchSelector } from '../common'

test('searchSelector', () => {
  expect(searchSelector({ search: [] })).toEqual([])
})

test('main saga', () => {
  testSaga(mainSaga)
    .next()
    .all([
      takeEvery('search/query', requestSearch),
      takeEvery('search/activeTab', requestSearch),
      fork(syncSearchSongs),
      fork(syncSearchPlaylists),
      fork(syncSearchArtist),
      fork(syncSearchAlbums)
    ])
    .next()
    .isDone()
})

describe('syncSongs', () => {
  const reducerType = 'song'
  const state = {
    query: '+1s',
    song: {
      offset: 100,
      songs: [],
      more: true
    }
  }

  test('find something to put', () => {
    testSaga(syncSearchSongs)
      .next()
      .take(`search/${reducerType}`)
      .next()
      .select(searchSelector)
      .next(state)
      .put({
        type: `search/${reducerType}/start`
      })
      .next()
      .save('ajax')
      .next({
        code: 200,
        result: {
          songs: [],
          songCount: 200
        }
      })
      .put({
        type: `search/${reducerType}/save`,
        payload: [],
        meta: {
          more: true,
          offset: 130
        }
      })
      .next()
      .restore('ajax')
      .next({ code: 404 })
      .put({
        type: `search/${reducerType}/end`
      })
      .next()
      .finish()
      .isDone()
  })

  test('nothing found', () => {
    testSaga(syncSearchSongs)
      .next()
      .take(`search/${reducerType}`)
      .next()
      .select(searchSelector)
      .next(state)
      .put({
        type: `search/${reducerType}/start`
      })
      .next()
      .save('ajax')
      .next({
        code: 200,
        result: {
          songs: undefined,
          songCount: 200
        }
      })
      .put(actions.toastAction('info', '什么也找不到'))
      .next()
      .put({
        type: `search/${reducerType}/end`
      })
      .next()
      .finish()
      .isDone()
  })

  test('geting last of resource', () => {
    testSaga(syncSearchSongs)
      .next()
      .take(`search/${reducerType}`)
      .next()
      .select(searchSelector)
      .next(state)
      .put({
        type: `search/${reducerType}/start`
      })
      .next()
      .next({
        code: 200,
        result: {
          songs: [],
          songCount: 50
        }
      })
      .put({
        type: `search/${reducerType}/save`,
        payload: [],
        meta: {
          more: false,
          offset: 130
        }
      })
      .next()
      .put({
        type: `search/${reducerType}/end`
      })
      .next()
      .finish()
      .isDone()
  })

  test('no more resource to sync', () => {
    testSaga(syncSearchSongs)
      .next()
      .take(`search/${reducerType}`)
      .next()
      .select(searchSelector)
      .next({
        more: false
      })
      .put({
        type: `search/${reducerType}/end`
      })
      .next()
      .finish()
      .next()
      .isDone()
  })
})

describe('requestSearch', () => {
  const prevState = {
    activeTab: 0,
    song: {
      query: 'older'
    }
  }
  const key = searchPageOrder[prevState.activeTab]
  test('query have not change or no query before', () => {
    testSaga(requestSearch)
      .next()
      .select(searchSelector)
      .next(prevState)
      .put({
        type: `search/${key}/query`
      })
      .next()
      .select(searchSelector)
      .next({ [key]: { query: 'walance' } })
      .put({
        type: `search/${key}`
      })
      .next()
      .isDone()
  })

  test('already requested or query string is empty', () => {
    testSaga(requestSearch)
      .next()
      .select(searchSelector)
      .next(prevState)
      .put({
        type: `search/${key}/query`
      })
      .next()
      .select(searchSelector)
      .next({ [key]: { query: undefined } })
      .isDone()
  })

})
