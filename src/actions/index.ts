import { createAction, Action } from 'redux-actions'
import {
  IToastPayload,
  IUserInfo,
  styleType
} from '../interfaces'
import { IPlayPayload } from '../reducers/player'
import { ITrack } from '../services/api'

export type IuserLogin = (userInfo: IUserInfo) => Action<IUserInfo>
export const userLogin: IuserLogin = createAction('user/login')

export const syncPlaylists = createAction('playlists/sync')

export type ItoastAction = (kind: styleType, text: string) => Action<IToastPayload>

export const toastAction: ItoastAction = createAction('ui/toast',
  (kind: styleType, text: string) => ({ kind, text})
)

export type ISearchQuery = (query: string) => Action<{ query: string}>

export const startSearch: ISearchQuery = createAction('search/query', (query: string) => ({ query }))

export const searchPlaylists = createAction('search/playlist')

export const searchSongs = createAction('search/song')

export const searchAlbums = createAction('search/album')

export const searchArtists = createAction('search/artist')

export const popupTrackActionSheet = createAction('playlists/track/popup')

export const hideTrackActionSheet = createAction('ui/popup/track/hide')

export const hideCollectActionSheet = createAction('ui/popup/collect/hide')

export const popupCollectActionSheet = createAction('playlists/collect/popup')

export const toCreatePlaylistAction = createAction('playlists/router/create')

export const collectTrackToPlayliast = createAction('playlists/collect')

export const createPlayliastAction = createAction('playlists/create')

export const playTrackAction: IPlayTrackAction = createAction('player/play',
  ({playingTrack, playlist, prev}: IPlayPayload) => {
    let obj: any
    obj.playingTrack = playingTrack
    if (playlist) {
      obj.playlist = playlist
    }
    obj.history = prev
    return obj
  }
)

export const changeStatusAction = createAction('player/status')

export const nextTrackAction = createAction('player/track/next')

export const prevTrackAction = createAction('player/track/prev')

export type IPlayTrackAction = (payload: IPlayPayload) => Action<IPlayPayload>

export const playAcion = createAction('player/play')

export type ISearchActiveTab = (activeTab: number) => Action<number>
export const changeSearchActiveTab: ISearchActiveTab = createAction('search/activeTab',
  (activeTab: number) => activeTab
)

export type ISyncDetail = (id: number) => Action<string>
export const syncPlaylistDetail: ISyncDetail = createAction('details/playlist',
  (id: number) => id
)

export const subscribePlaylist: ISyncDetail = createAction('details/playlist/subscribe',
  (id: number) => id
)

export const getComments: ISyncDetail = createAction('comments/sync',
  (id: string) => id
)

export const getMoreComments: ISyncDetail = createAction('comments/more',
  (id: string) => id
)
