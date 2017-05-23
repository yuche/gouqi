import mainSaga from '../album'
import { syncAlbum, refreshAlbums, syncMoreAlbums, albumSelector } from '../album'
import { takeLatest, takeEvery } from 'redux-saga/effects'
import { testSaga } from 'redux-saga-test-plan'
import { InteractionManager } from 'react-native'
import * as api from '../../services/api'
import * as actions from '../../actions'
test('main saga', () => {
  testSaga(mainSaga)
    .next()
    .all([
      takeLatest('albums/refresh', refreshAlbums),
      takeLatest('albums/sync', syncMoreAlbums),
      takeEvery('albums/detail', syncAlbum)
    ])
    .next()
    .isDone()
})

test('refreshAlbums', () => {
  testSaga(refreshAlbums)
    .next()
    .put({
      type: `albums/refresh/start`
    })
    .next()
    .next({code: 200, albums: []})
    .put({
      type: `albums/sync/save`,
      payload: [],
      meta: {
        more: true,
        offset: 30
      }
    })
    .next()
    .back(2)
    .next({ code: 404 })
    .put({
      type: `albums/refresh/end`
    })
    .next()
    .isDone()
})

describe('syncMoreAlbums', () => {
  test('offset equals 0', () => {
    testSaga(syncMoreAlbums)
      .next()
      .select()
      .next({
        album: {
          albums: [],
          offset: 0,
          more: true
        }
      })
      .put({
        type: `albums/sync/start`
      })
      .next()
      .save('before ajax')
      .next({
        code: 200,
        albums: [],
        more: true
      })
      .put({
        type: `albums/sync/save`,
        payload: [],
        meta: {
          more: true,
          offset: 30
        }
      })
      .next()
      .restore('before ajax')
      .next({code: 404})
      .put({
        type: `albums/sync/end`
      })
      .next()
      .isDone()
  })

  test('already requested and `more` key is not provided from ajax', () => {
    testSaga(syncMoreAlbums)
      .next()
      .select()
      .next({
        album: {
          albums: [],
          offset: 30,
          more: true
        }
      })
      .put({
        type: `albums/sync/start`
      })
      .next()
      .next({
        code: 200,
        albums: [],
        total: 100
      })
      .put({
        type: `albums/sync/save`,
        payload: [],
        meta: {
          more: true,
          offset: 60
        }
      })
      .next()
      .put({
        type: `albums/sync/end`
      })
      .next()
      .isDone()
  })

  test('no more results', () => {
    testSaga(syncMoreAlbums)
      .next()
      .select()
      .next({
        album: {
          albums: [],
          offset: 0,
          more: false
        }
      })
      .put(actions.toastAction('info', '没有更多资源了'))
      .next()
      .isDone()
  })
})

describe('syncAlbum', () => {
  test('albumSelector', () => {
    expect(albumSelector({ details: { albums: [] } })).toEqual([])
  })

  test('unit test', () => {
    const payload = 0
    testSaga(syncAlbum, { payload })
      .next()
      .call(InteractionManager.runAfterInteractions)
      .next()
      .select(albumSelector)
      .save('before select')
      .next([null])
      .put({
        type: 'details/playlist/start'
      })
      .next()
      .restore('before select')
      .next(['albums'])
      .call(Promise.all, [
        api.albumInfo(payload.toString()),
        api.albumDetail(payload.toString())
      ])
      .save('before ajax')
      .next([{ code: 200, album: { albums: [] } }, { code: 200, album: { description: 'description' } }])
      .put({
        type: 'details/album/save',
        payload: {
          [payload]: {
            albums: [],
            description: 'description'
          }
        }
      })
      .next()
      .restore('before ajax')
      .next([{ code: 404 }, { code: 404 }])
      .put({
        type: 'details/playlist/end'
      })
      .next()
      .isDone()
  })
})
