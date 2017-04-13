import {
    AsyncStorage,
    InteractionManager
} from 'react-native'
import RNFS from 'react-native-fs'
import { put, call, select, fork, take } from 'redux-saga/effects'
import { ITrack, batchSongDetailsNew, getUserId } from '../services/api'
import {
  toastAction,
  hideTrackActionSheet,
  downloadProgress,
  downloadFailed,
  removeDownloadingItem,
  clearDownloading,
  setDownloading
} from '../actions'
import { FILES_FOLDER, DOWNLOADED_TRACKS } from '../utils'
import { takeEvery, takeLatest, eventChannel, END } from 'redux-saga'
const IS_LOGIN = !!getUserId()

type ITracksPayload = { payload: ITrack[] }

function downloadTrackChannel(track: ITrack) {
  return eventChannel(emit => {
    RNFS.downloadFile({
      fromUrl: track.mp3Url,
      toFile: `${FILES_FOLDER}/${track.id}.mp3`,
      background: true,
      progress({ contentLength, bytesWritten }) {
        emit(downloadProgress(Math.floor(bytesWritten / contentLength * 100), track.id))
      }
    }).promise.then(res => {
      emit(removeDownloadingItem(track.id))
      emit(END)
    }).catch(_ => {
      emit(downloadFailed(track))
      emit(toastAction('error', `下载 ${track.name} 出现错误`))
      emit(END)
    })
    return () => ({})
  })
}

function* downloadSingleTrack (track: ITrack) {
  const downloading: ITrack[] = yield select((state: any) => state.download.downloading)
  const isDeleted = downloading.some(t => t.id === track.id)
  if (isDeleted) {
    return false
  }
  const channel = yield call(downloadTrackChannel, track.mp3Url, track.id)
  while (true) {
    const action = yield take(channel)
    yield put(action)
  }
}

export async function MergeDownloadedTracks (original, tracks) {
  const merged = original.concat(tracks)
  return await AsyncStorage.setItem(DOWNLOADED_TRACKS, JSON.stringify(merged))
}

function* downloadTracksSaga ({ payload }: ITracksPayload) {
  yield put(hideTrackActionSheet())
  yield call(InteractionManager.runAfterInteractions)
  yield put(toastAction('success', '已开始下载'))
  const downloadedTracks: number[] = yield select((state: any) => state.download.tracks.map(t => t.id))
  let tasks = payload.filter(t => downloadedTracks.indexOf(t.id) === -1)

  if (tasks.length > 0) {
    if (IS_LOGIN) {
      const response = yield call(batchSongDetailsNew, tasks.map(t => t.id.toString()))
      if (response.code === 200) {
        tasks = response.data.map(data => ({...data, mp3Url: data.url}))
      }
    }

    yield put(setDownloading(tasks))

    for (let task of tasks) {
      yield call(downloadSingleTrack, task)
    }

    yield put(clearDownloading())

  } else {
    yield put(toastAction('info', '已经下载过了'))
  }
}

function* mergeTracksSaga ({ payload }: ITracksPayload) {
  const downloadedTracks: ITrack[] = yield select((state: any) => state.download.tracks)

  yield call(MergeDownloadedTracks, downloadedTracks, payload)
}

function* setTracksSaga ({ payload }: ITracksPayload) {
  yield call(AsyncStorage.setItem, DOWNLOADED_TRACKS, JSON.stringify(payload))
}

function* clearAllDownload () {
  const downloads: any[] = yield call(RNFS.readDir, FILES_FOLDER)
  yield call(Promise.all, downloads.map(d => RNFS.unlink(d.path)))

  yield put({
    type: 'download/tracks/set',
    payload: []
  })

  yield put(toastAction('success', '所有下载项目都清除成功'))
}

function* deleteDownloadTrack ({ payload }) {
  const tracks: ITrack[] = yield select((state: any) => state.download.tracks.filter(t => t.id !== payload))

  yield put({
    type: 'download/tracks/set',
    payload: tracks
  })

  const path = `${FILES_FOLDER}/${payload}.mp3`

  yield fork(RNFS.unlink, path)
}

export default function* watchDownload () {
  yield [
    takeEvery('download/tracks', downloadTracksSaga),
    takeEvery('download/tracks/merge', mergeTracksSaga),
    takeEvery('download/tracks/set', setTracksSaga),
    takeLatest('download/clear', clearAllDownload),
    takeEvery('download/tracks/delete', deleteDownloadTrack)
  ]
}
