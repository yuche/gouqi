import { take, put, fork, select, call } from 'redux-saga/effects'
import { takeLatest } from 'redux-saga'
import {
  toastAction
} from '../actions'
import * as api from '../services/api'
import {
  ajaxCall,
  refreshResource,
  syncMoreResource
} from './common'

const refreshAlbums = refreshResource(
  'albums',
  api.newAlbums
)

const syncMoreAlbums = syncMoreResource(
  'albums',
  'album',
  api.newAlbums
)

export default function* watchAlbums() {
  yield [
    takeLatest('albums/refresh', refreshAlbums),
    takeLatest('albums/sync', syncMoreAlbums)
  ]
}
