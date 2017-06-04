import * as React from 'react'
import { IAlbum, ITrack } from '../services/api'
import {
  View,
  ViewStyle,
  Animated,
  Text,
  TextStyle,
  Image,
  Dimensions,
  TouchableOpacity,
  ListView,
  Alert,
  ListViewDataSource,
  ScrollViewProperties
} from 'react-native'
import Navbar from '../components/navbar'
import { ILoadingProps } from '../interfaces'
import { connect } from 'react-redux'
import {
  syncAlbumDetail,
  downloadTracksAction
} from '../actions'
import { get, isEqual } from 'lodash'
import Router from '../routers'
import ParallaxScroll from '../components/ParallaxScroll'
import { BlurView } from 'react-native-blur'
import Icon from 'react-native-vector-icons/FontAwesome'
import { IPlaying } from '../reducers/player'
import TrackList from '../components/TrackList'

const { width, height } = Dimensions.get('window')

function formatDate (str: string) {
  const date = new Date(str)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${year} 年 ${month} 月 ${day} 日`
}

interface IProps extends ILoadingProps {
  route: IAlbum,
  album: IAlbum,
  subscribing: boolean,
  playing: IPlaying,
  isPlaylist: boolean,
  subscribe: () => Redux.Action,
  collectAlbums: (tracks) => Redux.Action,
  download: (tracks: ITrack[]) => Redux.Action
}

interface IState {
  scrollY: Animated.Value
}

const HEADER_HEIGHT = 180

class Album extends React.Component<IProps, IState> {
  private ds: ListViewDataSource
  private scrollComponent: any

  constructor (props: IProps) {
    super(props)
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id})
    this.state = {
      scrollY: new Animated.Value(0)
    }
  }

  componentDidMount () {
    this.props.sync()
    this.setState({
      scrollY: this.scrollComponent.state.scrollY
    })
  }

  componentWillReceiveProps (nextProps: IProps) {
    if (!isEqual(nextProps.playing, this.props.playing)) {
      this.ds = this.ds.cloneWithRows([])
    }
  }

  render () {
    const {
      isLoading,
      album
    } = this.props
    const {
      scrollY
    } = this.state
    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        {this.renderBlur(album, scrollY)}
        {this.renderNavbar(album, scrollY)}
        {this.renderHeader(album, scrollY)}
        {this.renderPlayList(isLoading, scrollY, album.songs || [])}
      </View>
    )
  }

  renderNavbar (album: IAlbum, scrollY: Animated.Value ) {
    const opacity = scrollY.interpolate({
      inputRange: [0, 100, HEADER_HEIGHT],
      outputRange: [0, 0, 1]
    })
    return (
      <Navbar
        title={album.name}
        style={styles.navbar}
        titleStyle={{ opacity }}
      />
    )
  }

  renderHeader ( album: IAlbum, scrollY: Animated.Value ) {
    const uri = get(album, 'picUrl', '') + '?param=300y300'
    const { artist = { name: '' } } = album
    const opacity = scrollY.interpolate({
      inputRange: [0, 50, HEADER_HEIGHT],
      outputRange: [1, 1, 0]
    })
    const avatarUrl = get(artist, 'picUrl', '') + '?param=50y50'
    return (
      <View style={styles.headerContainer}>
        <Animated.View style={[styles.header, { opacity }]}>
          <View style={{ flexDirection: 'row'}}>
            <Image source={{uri}} style={styles.headerPic}/>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={[styles.white, { fontSize: 16 }]}>{album.name}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
                <Image source={{uri: avatarUrl}} style={{ width: 25, height: 25, borderRadius: 12.5 }}/>
                <Text style={[styles.white, { marginLeft: 5 }]}>{artist.name}</Text>
              </View>
              <Text style={[styles.white, { fontSize: 12, marginTop: 5 }]}>
                {`发行时间：${formatDate(album.publishTime)}`}
              </Text>
            </View>
          </View>
          {this.renderActions(album)}
        </Animated.View>
      </View>
    )
  }

  collectTracks = () => {
    this.props.collectAlbums({
      id: this.props.album.songs.map((t) => t.id)
    })
  }

  renderActions = (album: IAlbum) => {
    const {
      info,
      commentThreadId
    } = album
    const commentCount = get(info, 'commentCount', 0)
    return (
      <View style={{ flexDirection: 'row', paddingVertical: 10}}>
        <View style={styles.btnContainer}>
          {this.renderBtn('calendar-plus-o', this.collectTracks)}
        </View>
        <View style={styles.btnContainer}>
          {this.renderBtn('comment-o', () => Router.toComment({ route: { id: commentThreadId, album } }))}
          <Text style={{ color: 'white' }}>{commentCount}</Text>
        </View>
        <View style={styles.btnContainer}>
          {this.renderBtn('info-circle', Router.toPlaylistDetail({ route: album }))}
        </View>
        <View style={styles.btnContainer}>
          {this.renderBtn('download', this.downloadTrack)}
        </View>
      </View>
    )
  }

  downloadTrack = () => {
    Alert.alert(
      '',
      '确定下载全部吗？',
      [{
        text: '取消'
      }, {
        text: '确定',
        onPress: () => this.props.download(this.props.album.songs)
      }]
    )
  }

  renderBtn = (
    iconName: string,
    onPress?: (e?: any) => void
  ) => {
    return (
      <TouchableOpacity onPress={onPress} style={styles.btn}>
        <Icon name={iconName} size={16} color='#fff'/>
      </TouchableOpacity>
    )
  }

  renderBlur (album: IAlbum, scrollY: Animated.Value) {
    const uri = album.picUrl + '?param=300y300'
    const transform = [
      {
        translateY: scrollY.interpolate({
          inputRange: [-HEADER_HEIGHT, 0, HEADER_HEIGHT, HEADER_HEIGHT],
          outputRange: [HEADER_HEIGHT / 2, 0, -HEADER_HEIGHT / 3, -HEADER_HEIGHT / 3]
        })
      },
      {
        scale: scrollY.interpolate({
          inputRange: [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
          outputRange: [2, 1, 1]
        })
      }
    ]
    return (
      <Animated.Image source={{uri}} style={[styles.bg, { transform }]}>
        <BlurView blurType='light' blurAmount={25} style={styles.blur} />
      </Animated.Image>
    )
  }

  renderPlayList = (
    isLoading: boolean,
    scrollY: Animated.Value,
    tracks: ITrack[]
  ) => {
    const containerY = scrollY.interpolate({
      inputRange: [0 , HEADER_HEIGHT, HEADER_HEIGHT],
      outputRange: [0, -HEADER_HEIGHT, -HEADER_HEIGHT]
    })
    return (
      <Animated.View style={[styles.playlistContainer, { transform: [{ translateY: containerY }] }]}>
        <View style={{ height: height - Navbar.HEIGHT, backgroundColor: 'white'}}>
          <TrackList
            isLoading={isLoading}
            pid={this.props.route.id}
            tracks={tracks}
            showIndex={true}
            renderScrollComponent={this.renderScrollComponent}
          />
        </View>
      </Animated.View>
    )
  }

  renderScrollComponent = (props: ScrollViewProperties) => {
    return (
      <ParallaxScroll
        {...props}
        onScroll={props.onScroll}
        ref={this.mapScrollComponentToRef}
      />
    )
  }

  mapScrollComponentToRef = (component: any) => {
    this.scrollComponent = component
  }

}

const styles = {
  headerContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    paddingTop: Navbar.HEIGHT + 10,
    backgroundColor: 'rgba(0 ,0 , 0, .1)'
  } as ViewStyle,
  header: {
    paddingHorizontal: 16,
    flexDirection: 'column'
  } as ViewStyle,
  playlistContainer: {
    position: 'absolute',
    left: 0,
    top: Navbar.HEIGHT + HEADER_HEIGHT,
    right: 0,
    bottom: 0
  } as ViewStyle,
  headerPic: {
    width: 120,
    height: 120
  },
  blur: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width,
    height: width
  },
  bg: {
    width,
    height: width,
    resizeMode: 'cover'
  },
  white: {
    color: 'white'
  } as TextStyle,
  navbar: {
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    width
  } as ViewStyle,
  btnContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  } as ViewStyle,
  btn: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center'
  } as ViewStyle
}

function mapStateToProps (
  {
    details: {
      albums,
      isLoading,
      subscribing
    },
    player: {
      playing
    }
  },
  ownProps: IProps
) {
  const { route } = ownProps
  return {
    album: {
      ...route,
      ...albums[route.id],
      picUrl: route.picUrl
    },
    playing,
    isPlaylist: route.id === playing.pid,
    isLoading,
    subscribing
  }
}

export default connect(
  mapStateToProps,
  (dispatch, ownProps: IProps) => ({
    sync () {
      return dispatch(syncAlbumDetail(ownProps.route.id))
    },
    collectAlbums (tracks) {
      dispatch({ type: 'playlists/track/save', payload: tracks })
      return dispatch({ type: 'ui/popup/collect/show' })
    },
    download (track: ITrack[]) {
      return dispatch(downloadTracksAction(track))
    }
  })
)(Album)
