import { take, put, fork, select, call } from 'redux-saga/effects'
import { takeLatest } from 'redux-saga'
import * as api from '../services/api'
import {
  ajaxCall,
  refreshResource,
  syncMoreResource
} from './common'

const refreshArtists = refreshResource(
  'artists',
  api.topArtists,
  100
)

const syncMoreArtists = syncMoreResource(
  'artists',
  'artist',
  api.topArtists,
  100
)

export default function* watchArtists() {
  yield [
    takeLatest('artists/refresh', refreshArtists),
    takeLatest('artists/sync', syncMoreArtists)
  ]
}
