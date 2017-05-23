import mainSaga from '../album'
import { syncAlbum, refreshAlbums, syncMoreAlbums, albumSelector } from '../album'
import { takeLatest, takeEvery } from 'redux-saga/effects'
import { testSaga } from 'redux-saga-test-plan'
import { InteractionManager } from 'react-native'
import * as api from '../../services/api'

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
