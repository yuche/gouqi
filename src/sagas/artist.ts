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

const refreshArtists = refreshResource(
  'artists',
  'artist',
  api.newAlbums
)

const syncMoreArtists = syncMoreResource(
  'artists',
  'artist',
  api.newAlbums,
  state => state.artist,
  result => result.artists
)

export default function* watchAlbums() {
  yield [
    takeLatest('artists/refresh', refreshArtists),
    takeLatest('artists/sync', syncMoreArtists)
  ]
}
