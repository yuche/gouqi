import * as api from '../services/api'
import {
  Route
} from 'react'
import { ITrack } from '../services/api'
import { IPlayerMode, IPlayerStatus } from '../reducers/player'


export interface IUserInfo {
  username: string,
  password: string
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

export interface IAlbumsProps extends IInfiList {
  albums: any[]
}

export interface IArtistProps extends IInfiList {
  artists: any[]
}

export interface IToastPayload {
  kind: styleType,
  text: string,
  id: string
}

export interface IRouterProps {
  route?: Route
}

export interface ISearchPayload {
  query: string
}

export interface ILoadingProps {
  isLoading: boolean,
  sync: (e?: any) => Redux.Action
}

export interface ISearchState {
  query: string,
  activeTab: number,
  playlist: IPlaylistsProps,
  song: ISongsProps,
  album: IAlbumsProps,
  artist: IArtistProps
}


export interface IPlayerProps {
  prev: () => Redux.Action,
  next: () => Redux.Action,
  track: ITrack,
  status: IPlayerStatus,
  mode: IPlayerMode,
  uri: string,
  changeStatus: (status: IPlayerStatus, currentTime?: number) => Redux.Action
}
