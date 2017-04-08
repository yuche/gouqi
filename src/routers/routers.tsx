import * as React from 'react'
import {
  View
} from 'react-native'

import {Scene, Router, Actions} from 'react-native-router-flux'
import Home from '../containers/HomeScene'
import Login from '../containers/LoginScene'
import Search from '../containers/SearchScene'
import PlayList from '../containers/PlaylistDetailScene'
import Comment from '../containers/CommentScene'
import UIContainer from '../containers/UIContainer'
import DetailModal from '../components/DetailModal'
import CreatePlaylist from '../containers/CreatePlaylistScene'
import DownloadPlaylistScene from '../containers/DownloadPlaylistScene'
import PersonalPlaylistScene from '../containers/PersonalPlaylistScene'
import HistoryScene from '../containers/HistoryPlaylistScene'
import DailyRecommend from '../containers/DailyRecommend'
import AlbumsScene from '../containers/AlbumsScene'
import ArtistsScene from '../containers/ArtistsScene'
import AlbumDetail from '../containers/AlbumDetailScene'
import ArtistsDetail from '../containers/ArtistDetailScene'
import FavoriteArtists from '../containers/FavoriteArtistScene'

const scenes = Actions.create(
  <Scene key='root'>
    <Scene key='home' component={Home} hideNavBar initial/>
    <Scene key='login' component={Login} title='登录' direction='vertical'/>
    <Scene key='playlist' component={PlayList}/>
    <Scene key='search' component={Search} direction='vertical' hideNavBar panHandlers={null}/>
    <Scene key='comment' component={Comment} title='评论'/>
    <Scene key='DownloadPlaylistScene' component={DownloadPlaylistScene}/>
    <Scene key='PersonalPlaylistScene' component={PersonalPlaylistScene}/>
    <Scene key='DailyRecommend' component={DailyRecommend}/>
    <Scene key='HistoryScene' component={HistoryScene}/>
    <Scene key='AlbumsScene' component={AlbumsScene}/>
    <Scene key='ArtistsScene' component={ArtistsScene}/>
    <Scene key='AlbumDetail' component={AlbumDetail}/>
    <Scene key='ArtistsDetail' component={ArtistsDetail}/>
    <Scene key='FavoriteArtists' component={FavoriteArtists}/>
    <Scene key='playlistDetail' component={DetailModal} direction='fade'/>
    <Scene key='createPlaylist' component={CreatePlaylist} direction='vertical'/>
  </Scene>
)

const Routers = () => (
  <View style={{flex: 1}}>
      <Router scenes={scenes}/>
      <UIContainer />
  </View>
)

export default Routers
