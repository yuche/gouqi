import {
  AsyncStorage
} from 'react-native'
import * as RNFS from 'react-native-fs'
import { put, call, select, fork, take, takeEvery, takeLatest, all } from 'redux-saga/effects'
import { ITrack, batchSongDetailsNew } from '../services/api'
import {
  toastAction,
  hideTrackActionSheet,
  downloadProgress,
  downloadFailed,
  removeDownloadingItem,
  setDownloading,
  downloadSuccess,
  deleteDownloadTrack
} from '../actions'
import { ajaxCall } from './common'
import { FILES_FOLDER, DOWNLOADED_TRACKS } from '../utils'
import { eventChannel, END } from 'redux-saga'
import { get } from 'lodash'

function streamLength (length: number) {
  return (length / 10e5).toFixed(1)
}

export const downloadSelector = (state: any) => state.download

let currentDownloadJob = Object.create(null)

export function downloadTrackChannel (track) {
  return eventChannel((emit) => {
    const toFile = `${FILES_FOLDER}/${track.id}.mp3`
    RNFS.downloadFile({
      fromUrl: track.mp3Url,
      toFile,
      background: true,
      begin ({ jobId }) {
        currentDownloadJob.jobId = jobId
        currentDownloadJob.trackId = track.id
      },
      progress ({ contentLength, bytesWritten }) {
        emit(downloadProgress({
          total: streamLength(contentLength),
          receive: streamLength(bytesWritten),
          id: track.id
        }))
      }
    }).promise.then((_) => {
      currentDownloadJob = Object.create(null)
      emit(removeDownloadingItem(track.id))
      emit(downloadSuccess({
        ...track,
        mp3Url: toFile
      }))
      emit(END)
    }).catch((err: Error) => {
      currentDownloadJob = Object.create(null)
      if (!err.message.includes('abort')) {
        emit(downloadFailed(track))
        emit(toastAction('error', `下载 ${track.name} 出现错误`))
      }
      emit(END)
    })
    return () => ({})
  })
}

export function* downloadSingleTrack (track: ITrack) {
  const { downloading } = yield select(downloadSelector)
  const isExist = downloading.some((t) => t.id === track.id)
  if (!isExist || !track.mp3Url) {
    return false
  }
  const channel = yield call(downloadTrackChannel, track)
  while (true   /* istanbul ignore next  */) {
    const action = yield take(channel)
    yield put(action)
  }
}

export function* downloadTracksSaga ({ payload }: any) {
  yield put(hideTrackActionSheet())
  let { tracks } = yield select(downloadSelector)
  tracks = tracks.map((t) => t.id)
  let tasks = payload.filter((t) => !tracks.includes(t.id))
  if (tasks.length > 0) {

    const response = yield* ajaxCall(batchSongDetailsNew, tasks.map((t) => t.id.toString()))
    if (response.code === 200) {
      tasks = tasks.map((task) => {
        const { url } = response.data.find((data) => Number(data.id) === Number(task.id))
        return url ? {...task, mp3Url: url} : task
      })
    }

    yield put(setDownloading(tasks))

    for (const task of tasks) {
      yield call(downloadSingleTrack, task)
    }

  } else {
    yield put(toastAction('info', '已经下载过了'))
  }
}

export function* mergeTracksSaga ({ payload }: any) {
  const { tracks } = yield select(downloadSelector)

  yield fork(AsyncStorage.setItem, DOWNLOADED_TRACKS, JSON.stringify(tracks.concat(payload)))
}

export function* stopCurrentDownloadSaga () {
  const jobId = yield call(get, currentDownloadJob, 'jobId')
  if (jobId) {
    yield call(RNFS.stopDownload, jobId)
    yield put(removeDownloadingItem(currentDownloadJob.trackId))
    yield put(deleteDownloadTrack(currentDownloadJob.trackId))
  }
}

export function* setTracksSaga ({ payload }: any) {
  yield call(AsyncStorage.setItem, DOWNLOADED_TRACKS, JSON.stringify(payload))
}

export function* clearAllDownload () {
  const downloads: any[] = yield call(RNFS.readDir, FILES_FOLDER)
  yield call(Promise.all, downloads.map((d) => RNFS.unlink(d.path)))

  yield put({
    type: 'download/tracks/set',
    payload: []
  })

  yield put(toastAction('success', '所有下载项目都清除成功'))
}

export function* deleteDownloadTrackSaga ({ payload }: any) {
  let { tracks } = yield select(downloadSelector)

  tracks = tracks.filter((t) => t.id !== payload)

  yield put({
    type: 'download/tracks/set',
    payload: tracks
  })

  const path = `${FILES_FOLDER}/${payload}.mp3`

  yield fork(RNFS.unlink, path)
}

export default function* watchDownload () {
  yield all([
    takeEvery('download/tracks', downloadTracksSaga),
    takeEvery('download/tracks/merge', mergeTracksSaga),
    takeEvery('download/tracks/set', setTracksSaga),
    takeLatest('download/stop', stopCurrentDownloadSaga),
    takeLatest('download/clear', clearAllDownload),
    takeEvery('download/tracks/delete', deleteDownloadTrackSaga)
  ])
}
