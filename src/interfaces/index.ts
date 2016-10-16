import * as api from '../services/api'

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

export interface IPlaylistsProps {
  isLoading: boolean,
  playlists: api.IPlaylist[],
  offset: number,
  more: boolean
}
