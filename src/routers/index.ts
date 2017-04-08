import { Actions } from 'react-native-router-flux'

interface IRouterPassProps {
  route?: Object | undefined
}

let navigator = Actions

function toHome (passProps?: IRouterPassProps) {
  navigator['home'](passProps)
}

function toLogin (passProps?: IRouterPassProps) {
  return () => navigator['login'](passProps)
}

function toSearch (passProps?: IRouterPassProps) {
  navigator['search'](passProps)
}

function toPlayList (passProps?: IRouterPassProps) {
  return () => navigator['playlist'](passProps)
}

function toComment (passProps?: IRouterPassProps) {
  return () => navigator['comment'](passProps)
}

function toPlaylistDetail (passProps?: IRouterPassProps) {
  return () => navigator['playlistDetail'](passProps)
}

function toCreatePlaylist (passProps?: IRouterPassProps) {
  navigator['createPlaylist'](passProps)
}

function toDownloads (passProps?: IRouterPassProps) {
  return () => navigator['DownloadPlaylistScene'](passProps)
}

function toPersonalPlaylist (passProps?: IRouterPassProps) {
  return () => navigator['PersonalPlaylistScene'](passProps)
}

function toHistoryScene (passProps?: IRouterPassProps) {
  return () => navigator['HistoryScene'](passProps)
}

function toDailyRecommend (passProps?: IRouterPassProps) {
  return () => navigator['DailyRecommend'](passProps)
}

function toAlbums (passProps?: IRouterPassProps) {
  navigator['AlbumsScene'](passProps)
}

function toArtists (passProps?: IRouterPassProps) {
  navigator['ArtistsScene'](passProps)
}

function toAlbumDetail (passProps?: IRouterPassProps) {
  navigator['AlbumDetail'](passProps)
}
function toArtistsDetail (passProps?: IRouterPassProps) {
  navigator['ArtistsDetail'](passProps)
}

function toFavoriteArtists (passProps?: IRouterPassProps) {
  navigator['FavoriteArtists'](passProps)
}

function pop (passProps?: IRouterPassProps) {
  navigator.pop(passProps)
}


const Router = {
  toHome,
  toLogin,
  toSearch,
  toPlayList,
  toComment,
  toPlaylistDetail,
  toCreatePlaylist,
  toDownloads,
  toPersonalPlaylist,
  toHistoryScene,
  toDailyRecommend,
  toAlbums,
  toArtists,
  toAlbumDetail,
  toArtistsDetail,
  toFavoriteArtists,
  pop
}

export default Router
