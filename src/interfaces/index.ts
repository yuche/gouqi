import * as api from '../services/api'
import { ITrack } from '../services/api'
import { IPlayerMode, IPlayerStatus } from '../reducers/player'
import { IPlaying } from '../reducers/player'
export interface IUserInfo {
  username: string,
  password: string
}

export type styleType = 'success' | 'info' | 'warning' | 'error'

export interface IInfiList {
  isLoading: boolean,
  offset: number,
  more: boolean,
  query?: string,
  syncMore: () => Redux.Action,
  refresh: () => Redux.Action,
  isRefreshing: boolean
}

export interface IPlaylistsProps extends IInfiList {
  playlists: api.IPlaylist[]
}

export interface IPlaylistProps {
  tracks: ITrack[],
  playing: IPlaying,
  play: (index: number, tracks: ITrack[]) => Redux.Action,
  popup: (track: ITrack) => Redux.Action,
  isPlaylist: boolean
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
  route?: any
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
  track: ITrack,
  status: IPlayerStatus,
  mode: IPlayerMode,
  currentTime: number,
  duration: number,
  uri: string,
  slideTime: number,
  isSliding: boolean,
  setMode: (mode) => Redux.Action,
  download: () => Redux.Action,
  popup: () => Redux.Action,
  showPlaylist: () => Redux.Action,
  showLyrics: () => Redux.Action,
  prev: () => Redux.Action,
  next: () => Redux.Action,
  changeStatus: (status: IPlayerStatus) => Redux.Action,
  setCurrentTime: (currentTime) => Redux.Action,
  setDuration: (duration) => Redux.Action,
  setSlideTime: (time) => Redux.Action,
  toggleSlide: (bool) => Redux.Action
}
