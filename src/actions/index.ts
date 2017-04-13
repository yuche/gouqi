import { createAction, Action } from 'redux-actions'
import {
  IToastPayload,
  IUserInfo,
  styleType
} from '../interfaces'
import { IPlayPayload } from '../reducers/player'

export const addSecondsAction = createAction('🐸🐸🐸')

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

export const createPlayliastAction = createAction('personal/playlist/create')

export const deletePlayliastAction = createAction('personal/playlist/delete')

export const deleteHistoryAction = createAction('player/history/delete')

export const setHistoryAction = createAction('player/history/save')

export const playTrackAction: IPlayTrackAction = createAction('player/play',
  ({playing, playlist, prev}: IPlayPayload) => {
    let playingCopy = playing
    playingCopy.index = Number(playing.index)
    return {
      playing: playingCopy,
      playlist
    }
  }
)

export const downloadTracksAction = createAction('download/tracks')

export const changeStatusAction = createAction('player/status', (status) => ({
  status
}))

export const durationAction = createAction('player/duration')

export const currentTimeAction = createAction('player/currentTime')

export const nextTrackAction = createAction('player/track/next')

export const prevTrackAction = createAction('player/track/prev')

export const clearDownloadAction = createAction('download/clear')

export const deleteDownloadTrack = createAction('download/tracks/delete')

export type IPlayTrackAction = (payload: IPlayPayload) => Action<IPlayPayload>

export type ISearchActiveTab = (activeTab: number) => Action<number>
export const changeSearchActiveTab: ISearchActiveTab = createAction('search/activeTab',
  (activeTab: number) => activeTab
)

export const downloadProgress = createAction('download/progress')

export const downloadFailed = createAction('download/failed/merge')

export const clearDownloading = createAction('download/downloading/clear')

export const setDownloading = createAction('download/downloading/set')

export const syncAlbumDetail: ISyncDetail = createAction('albums/detail',
  (id: number) => id
)

export type ISyncDetail = (id: number) => Action<string>
export const syncPlaylistDetail: ISyncDetail = createAction('details/playlist',
  id => id
)
export const removeDownloadingItem: ISyncDetail = createAction('download/downloading/remove',
  id => id
)
export const syncArtistTracks: ISyncDetail = createAction('artists/detail/track',
  id => id
)
export const syncArtistAlbums: ISyncDetail = createAction('artists/detail/album',
  id => id
)
export const syncArtistDescription: ISyncDetail = createAction('artists/detail/description',
  id => id
)
export const followArtist: ISyncDetail = createAction('artists/detail/follow',
  id => id
)

export const downloadSuccess = createAction('download/tracks/merge')

export const subscribePlaylist: ISyncDetail = createAction('details/playlist/subscribe',
  id => id
)

export const getComments: ISyncDetail = createAction('comments/sync',
  id => id
)

export const getMoreComments: ISyncDetail = createAction('comments/more',
  id => id
)

export const stopCurrentDownload = createAction('download/stop')
