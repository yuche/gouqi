import {
  downloadTracksSaga,
  downloadSelector,
  downloadSingleTrack,
  downloadTrackChannel,
  mergeTracksSaga,
  stopCurrentDownloadSaga,
  setTracksSaga,
  clearAllDownload,
  deleteDownloadTrackSaga
} from '../download'
import * as actions from '../../actions'
import { testSaga } from 'redux-saga-test-plan'
import { eventChannel } from 'redux-saga'
import { AsyncStorage } from 'react-native'
import { get } from 'lodash'
import * as RNFS from 'react-native-fs'
import { FILES_FOLDER } from '../../utils'
import mainSaga from '../download'
import { takeLatest, takeEvery } from 'redux-saga/effects'

const state = {
  tracks: [{ id: 1 }],
  downloading: []
}

describe('downloadTracksSaga', () => {
  test('already downloaded', () => {
    testSaga(downloadTracksSaga, { payload: [{ id: 1 }] })
      .next()
      .put(actions.hideTrackActionSheet())
      .next()
      .select(downloadSelector)
      .next(state)
      .put(actions.toastAction('info', '已经下载过了'))
      .next()
      .isDone()
  })

  test('download tracks success', () => {
    const payload = [{ id: 123 }]
    testSaga(downloadTracksSaga, { payload })
      .next()
      .put(actions.hideTrackActionSheet())
      .next()
      .select(downloadSelector)
      .next(state)
      .next({ code: 200, data: payload })
      .back()
      .next({ code: 404 })
      .put(actions.setDownloading(payload))
      .next()
      .call(downloadSingleTrack, payload[0])
      .next()
      .isDone()
  })

  test('download tracks should replace mp3Url with batchSongDetailsNew api', () => {
    const payload = [{ id: 123 }]
    testSaga(downloadTracksSaga, { payload })
      .next()
      .put(actions.hideTrackActionSheet())
      .next()
      .select(downloadSelector)
      .next(state)
      .next({ code: 200, data: [{
        id: 123,
        url: '+1s'
      }] })
      .put(actions.setDownloading([{
        id: 123,
        mp3Url: '+1s'
      }]))
      .next()
      .call(downloadSingleTrack, {
        id: 123,
        mp3Url: '+1s'
      })
      .next()
      .isDone()
  })
})

describe('downloadSingleTrack', () => {
  test('if downloading should returns false', () => {
    testSaga(downloadSingleTrack, { id: 1 })
      .next()
      .select(downloadSelector)
      .next({
        ...state,
        downloading: [{ id: 1 }]
      })
      .returns(false)
  })

  test('should call the download channel', () => {
    const track = { id: 2, mp3Url: '+1s' }
    testSaga(downloadSingleTrack, track)
      .next()
      .select(downloadSelector)
      .next(state)
      .call(downloadTrackChannel, track)
      .next('channel')
      .take('channel')
      .next('action')
      .put('action')
      .next()
      .take('channel')
      .next('action2')
      .put('action2')
      .next()
      .finish()
      .next()
      .isDone()
  })

  test('eventChannel', () => {
    // const channel = downloadTrackChannel({ id: 1, mp3Url: '+1s' })
    expect(downloadTrackChannel({ id: 1, mp3Url: '+1s' })).toHaveProperty('take')
    expect(downloadTrackChannel({ id: 1 })).toHaveProperty('take')
  })
})

test('download selector', () => {
  expect(downloadSelector({download: []})).toEqual([])
})

test('mergeTracksSaga', () => {
  testSaga(mergeTracksSaga, { payload: [] })
    .next()
    .select(downloadSelector)
    .next(state)
    .fork(AsyncStorage.setItem, 'DOWNLOADED_TRACKS', JSON.stringify(state.tracks))
    .next()
    .isDone()
})

test('stopCurrentDownloadSaga', () => {
  testSaga(stopCurrentDownloadSaga)
    .next()
    .call(get, Object.create(null), 'jobId')
    .save('before get')
    .next(1)
    .call(RNFS.stopDownload, 1)
    .next()
    .put(actions.removeDownloadingItem(undefined))
    .next()
    .put(actions.deleteDownloadTrack(undefined))
    .next()
    .restore('before get')
    .next(undefined)
    .isDone()
})

test('setTracksSaga', () => {
  testSaga(setTracksSaga, { payload: [] })
    .next()
    .call(AsyncStorage.setItem, 'DOWNLOADED_TRACKS', JSON.stringify([]))
    .next()
    .isDone()
})

test('clearAllDownload', () => {
  testSaga(clearAllDownload)
    .next()
    .call(RNFS.readDir, FILES_FOLDER)
    .next([{ path: 'wallace' }])
    .call(Promise.all, [RNFS.unlink('wallace')])
    .next()
    .put({
      type: 'download/tracks/set',
      payload: []
    })
    .next()
    .put(actions.toastAction('success', '所有下载项目都清除成功'))
    .next()
    .isDone()
})

test('deleteDownloadTrackSaga', () => {
  testSaga(deleteDownloadTrackSaga, { payload: 1 })
    .next()
    .select(downloadSelector)
    .next(state)
    .put({
      type: 'download/tracks/set',
      payload: []
    })
    .next()
    .fork(RNFS.unlink, `${FILES_FOLDER}/1.mp3`)
    .next()
    .isDone()
})

test('mainSaga', () => {
  testSaga(mainSaga)
    .next()
    .all([
      takeEvery('download/tracks', downloadTracksSaga),
      takeEvery('download/tracks/merge', mergeTracksSaga),
      takeEvery('download/tracks/set', setTracksSaga),
      takeLatest('download/stop', stopCurrentDownloadSaga),
      takeLatest('download/clear', clearAllDownload),
      takeEvery('download/tracks/delete', deleteDownloadTrackSaga)
    ])
    .next()
    .isDone()
})
