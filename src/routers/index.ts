/**
 * VERY BAD PRATICE
 * 千万不要像这样写，当时我贪图一时便利鬼迷心窍几个这样的路由，
 * 后来越来越多重构也不好做了……
 * 另外路由也不推荐 react-native-router-flux，可以去试一下 react-navigation，
 * 或者如果是新版本的 React Native 可以自己写
 */

import { Actions } from 'react-native-router-flux'

interface IRouterPassProps {
  route?: {} | undefined
}

const navigator = Actions

function toHome (passProps?: IRouterPassProps) {
  navigator['home'](passProps)
}

function toLogin (passProps?: any) {
  navigator['login'](passProps)
}

function toSearch (passProps?: IRouterPassProps) {
  navigator['search'](passProps)
}

function toPlayList (passProps?: IRouterPassProps) {
  return () => navigator['playlist'](passProps)
}

function toComment (passProps?: any) {
  navigator['comment'](passProps)
}

function toPlaylistDetail (passProps?: IRouterPassProps) {
  return () => navigator['playlistDetail'](passProps)
}

function toCreatePlaylist (passProps?: any) {
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

function toDownloading (passProps?: IRouterPassProps) {
  navigator['Downloading'](passProps)
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
  toDownloading,
  pop
}

export default Router
