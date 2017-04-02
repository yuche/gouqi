import * as React from 'react'
import {
  StyleSheet,
  Text,
  TextStyle,
  View,
  ScrollView,
  ViewStyle,
  RefreshControl,
  TouchableWithoutFeedback,
  ListView
} from 'react-native'
import { IArtist, IAlbum, IPlaylist, ITrack } from '../services/api'
import { connect } from 'react-redux'
import Router from '../routers'
import Icon from 'react-native-vector-icons/FontAwesome'
import Ionic from 'react-native-vector-icons/Ionicons'
import Grid from '../components/grid'
import { isEmpty, isEqual, get } from 'lodash'
import { playCount } from '../utils'
import { Color } from '../styles'
import { IPlaylistProps } from '../interfaces'
import ListItem from '../components/listitem'
import {
  popupTrackActionSheet,
  playTrackAction
} from '../actions'

interface IProps extends IPlaylistProps {
  albums: IAlbum[],
  artists: IArtist[],
  playlists: IPlaylist[],
  tracks: ITrack[],
  isLoading: boolean,
  sync: () => Redux.Action,
  gotoPlaylist: () => void
}

class RecommendScene extends React.Component<IProps, any> {
  private ds: React.ListViewDataSource

  constructor(props: any) {
    super(props)
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id})
  }

  componentWillReceiveProps (nextProps: IProps) {
    if (!isEqual(nextProps.playing, this.props.playing)) {
      this.ds = this.ds.cloneWithRows([])
    }
  }

  renderTrack = (playing, isPlaylist: boolean) => {
    return (track: ITrack, sectionId, rowId) => {
      const index = Number(rowId)
      const isPlaying = playing.index === index && isPlaylist
      const artistName = get(track, 'artists[0].name', null)
      const albumName = get(track, 'album.name', '')
      const subTitle = artistName ?
        `${artistName} - ${albumName}` :
        albumName
      const colorStyle = isPlaying && { color: Color.main }
      return <ListItem
        title={track.name}
        containerStyle={{ paddingVertical: 0, paddingRight: 0 }}
        picURI={track.album.picUrl + '?param=75y75'}
        subTitle={subTitle}
        noBorder={true}
        textContainer={{ paddingVertical: 10 }}
        picStyle={{ width: 40, height: 40}}
        titleStyle={[{ fontSize: 15 }, colorStyle]}
        subTitleStyle={colorStyle}
        onPress={!isPlaying ? this.listItemOnPress(index) : undefined}
        renderRight={
          <TouchableWithoutFeedback
            onPress={this.moreIconOnPress(track)}
          >
            <View style={{flexDirection: 'row', paddingRight: 10}}>
              {isPlaying && <View style={{ justifyContent: 'center' }}>
                <Ionic size={22} name='md-volume-up' color={Color.main} style={{ paddingLeft: 10 }}/>
              </View>}
              <View style={{ justifyContent: 'center' }}>
                <Ionic size={22} name='ios-more' color='#777' style={{ paddingLeft: 10 }}/>
              </View>
            </View>
          </TouchableWithoutFeedback>
        }
        key={track.id}
      />
    }
  }

  listItemOnPress = (id: number) => () => {
    this.props.play(id, this.props.tracks)
  }

  moreIconOnPress = (track: ITrack) => () => {
    this.props.popup(track)
  }

  renderHeader (title: string, onPress?) {
    const {
      playlists,
      isLoading
    } = this.props
    if (isEmpty(playlists) && isLoading) {
      return <View />
    }
    return (
      <TouchableWithoutFeedback onPress={onPress}>
        <View style={styles.header}>
          <Text style={{ fontSize: 16, marginLeft: 5 }}>{title}</Text>
          <Icon size={16} color='#ccc' name='chevron-right' style={{ marginLeft: 5 }}/>
        </View>
      </TouchableWithoutFeedback>
    )
  }

  toPlaylistDetail = (playlist: IPlaylist) => {
    Router.toPlayList({ route: playlist })()
  }

  toAlbumDetail = (album: IAlbum) => {
    Router.toAlbumDetail({ route: album })
  }

  render () {
    const {
      playlists,
      albums,
      artists,
      tracks,
      sync,
      isLoading,
      gotoPlaylist,
      playing,
      isPlaylist
    } = this.props
    if (tracks) {
      this.ds = this.ds.cloneWithRows(tracks)
    }
    return (
      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={sync}/>
        }
      >
        {!isEmpty(playlists) && this.renderHeader('推荐歌单', gotoPlaylist)}
        <Grid data={playlists} onPress={this.toPlaylistDetail}/>
        {!isEmpty(albums) && this.renderHeader('最新专辑', Router.toAlbums)}
        <Grid data={albums} onPress={this.toAlbumDetail}/>
        {!isEmpty(artists) && this.renderHeader('热门歌手', Router.toArtists)}
        <Grid data={artists} onPress={() => ({})}/>
        {!isEmpty(tracks) && this.renderHeader('每日推荐', Router.toDailyRecommend())}
        <ListView
          enableEmptySections
          removeClippedSubviews={true}
          scrollRenderAheadDistance={120}
          initialListSize={10}
          dataSource={this.ds}
          renderRow={this.renderTrack(playing, isPlaylist)}
          showsVerticalScrollIndicator={false}
        />
      </ScrollView>
    )
  }
}

function mapStateToProps ({
  playlist: {
    playlists
  },
  home: {
    albums,
    artists,
    isLoading
  },
  personal: {
    daily
  },
  player: {
    playing
  }
}) {
  return {
    playlists: playlists.slice(0, 6).map(p => ({
      ...p,
      meta: playCount(p.playCount)
    })),
    tracks: daily,
    isPlaylist: playing.pid === 'daily',
    albums,
    artists,
    playing,
    isLoading
  }
}

export default connect(mapStateToProps,
  (dispatch) => ({
    sync() {
      return dispatch({type: 'home/recommend'})
    },
    popup(track: ITrack) {
      return dispatch(popupTrackActionSheet(track))
    },
    play(index: number, tracks: ITrack[]) {
      return dispatch(playTrackAction({
        playing: {
          index,
          pid: 'daily'
        },
        playlist: tracks
      }))
    }
  })
)(RecommendScene) as React.ComponentClass<{tabLabel: string, gotoPlaylist: any}>

const styles = StyleSheet.create({
  header: {
    marginTop: 10,
    marginBottom: 15,
    flexDirection: 'row',
    borderLeftColor: Color.main,
    borderLeftWidth: 2
  } as ViewStyle,
  instructions: {
    color: '#333333',
    marginBottom: 5,
    textAlign: 'center'
  } as TextStyle,
  welcome: {
    fontSize: 20,
    margin: 10,
    textAlign: 'center'
  } as TextStyle
})
