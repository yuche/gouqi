import * as api from '../services/api'
import {
  Route
} from 'react'
import Router from '../routers'
export interface IUserInfo {
  username: string,
  password: string
}

/**
 * Flux Standard Action created by redux-actions
 * https://github.com/acdlite/flux-standard-action
 */
export interface IFSA<T> {
  type: string,
  payload: T,
  error?: boolean
}

export type styleType = 'success' | 'info' | 'warning' | 'error'

export interface IInfiList {
  isLoading: boolean,
  offset: number,
  more: boolean,
  query?: string
}

export interface IPlaylistsProps extends IInfiList {
  playlists: api.IPlaylist[]
}

export interface ISongsProps extends IInfiList {
  songs: any[]
}

export interface IToastPayload {
  kind: styleType,
  text: string,
  id: string
}

export interface IRouterProps {
  route?: Route,
  router?: Router
}

export interface ISearchPayload {
  query: string
}

export interface ISearchState {
  query: string,
  activeTab: number,
  playlist: IPlaylistsProps,
  song: ISongsProps
}
