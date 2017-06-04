import * as React from 'react'
import { IPlaylist, ITrack } from '../services/api'
import {
  View,
  ViewStyle,
  Animated,
  ActivityIndicator,
  Text,
  TextStyle,
  Image,
  Dimensions,
  TouchableOpacity,
  Alert,
  ScrollViewProperties
} from 'react-native'
import Navbar from '../components/navbar'
import { ILoadingProps } from '../interfaces'
import { connect } from 'react-redux'
import {
  syncPlaylistDetail,
  subscribePlaylist,
  downloadTracksAction
} from '../actions'
import {
  IinitialState as IDetailState
} from '../reducers/detail'
import Router from '../routers'
import ParallaxScroll from '../components/ParallaxScroll'
import { BlurView } from 'react-native-blur'
import Icon from 'react-native-vector-icons/FontAwesome'
import TrackList from '../components/TrackList'

import { IPlaying } from '../reducers/player'

const { width, height } = Dimensions.get('window')

interface IProps extends ILoadingProps {
  route: IPlaylist,
  playlist: IPlaylist,
  subscribing: boolean,
  playing: IPlaying,
  isPlaylist: boolean,
  subscribe: () => Redux.Action,
  download: (tracks: ITrack[]) => Redux.Action
}

const HEADER_HEIGHT = 180

class PlayList extends React.Component<IProps, any> {
  private scrollComponent: any

  private scrollY: Animated.Value

  private headerOpacity: any

  private blurTransform: any

  private playlistTransform: any

  constructor (props: IProps) {
    super(props)
    this.scrollY = new Animated.Value(0)
  }

  componentDidMount () {
    this.props.sync()
    this.scrollY = this.scrollComponent.state.scrollY
    this.headerOpacity = {
      opacity: this.scrollY.interpolate({
        inputRange: [0, 50, HEADER_HEIGHT],
        outputRange: [1, 1, 0]
      })
    }
    this.blurTransform = {
      transform: [
        {
          translateY: this.scrollY.interpolate({
            inputRange: [-HEADER_HEIGHT, 0, HEADER_HEIGHT, HEADER_HEIGHT],
            outputRange: [HEADER_HEIGHT / 2, 0, -HEADER_HEIGHT / 3, -HEADER_HEIGHT / 3]
          })
        },
        {
          scale: this.scrollY.interpolate({
            inputRange: [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            outputRange: [2, 1, 1]
          })
        }
      ]
    }
    this.playlistTransform = {
      transform: [{
      translateY: this.scrollY.interpolate({
        inputRange: [0, HEADER_HEIGHT, HEADER_HEIGHT],
        outputRange: [0, -HEADER_HEIGHT, -HEADER_HEIGHT]
      })}]
    }
  }

  render () {
    const {
      isLoading,
      playlist
    } = this.props
    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        {this.renderBlur(playlist)}
        {this.renderNavbar(playlist)}
        {this.renderHeader(playlist)}
        {this.renderPlayList(isLoading, playlist.tracks || [])}
      </View>
    )
  }

  renderNavbar (playlist: IPlaylist) {
    return (
      <Navbar
        title={playlist.name}
        style={styles.navbar}
        titleStyle={{
          opacity: this.scrollY.interpolate({
            inputRange: [0, 100, HEADER_HEIGHT],
            outputRange: [0, 0, 1]
          })
        }}
      />
    )
  }

  renderHeader ( playlist: IPlaylist) {
    const uri = playlist.coverImgUrl
    const { creator } = playlist
    const avatarUrl = creator.avatarUrl + '?param=30y30'
    return (
      <View style={styles.headerContainer}>
        <Animated.View style={[styles.header, this.headerOpacity]}>
          <View style={{ flexDirection: 'row'}}>
            <Image source={{uri}} style={styles.headerPic}/>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={[styles.white, { fontSize: 16 }]}>{playlist.name}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
                <Image source={{uri: avatarUrl}} style={{ width: 25, height: 25, borderRadius: 12.5 }}/>
                <Text style={[styles.white, { marginLeft: 5 }]}>{creator.nickname}</Text>
              </View>
            </View>
          </View>
          {this.renderActions(playlist)}
        </Animated.View>
      </View>
    )
  }

  renderActions = (playlist: IPlaylist) => {
    const {
      subscribed,
      subscribedCount,
      commentCount,
      commentThreadId
    } = playlist
    const {
      subscribing,
      subscribe
    } = this.props
    return (
      <View style={{ flexDirection: 'row', paddingVertical: 10}}>
        <View style={styles.btnContainer}>
          {this.rendeSubIcon(subscribed, subscribing, subscribe)}
          <Text style={{ color: 'white' }}>{subscribedCount}</Text>
        </View>
        <View style={styles.btnContainer}>
          {this.renderBtn('comment-o', () => Router.toComment({ route: { id: commentThreadId, playlist } }))}
          <Text style={{ color: 'white' }}>{commentCount}</Text>
        </View>
        <View style={styles.btnContainer}>
          {this.renderBtn('info-circle', Router.toPlaylistDetail({ route: playlist }))}
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
        onPress: () => this.props.download(this.props.playlist.tracks)
      }]
    )
  }

  rendeSubIcon = (
    subscribed: boolean,
    subscribing: boolean,
    subscribe: () => Redux.Action
  ) => {
    if (subscribing) {
      return <ActivityIndicator animating={true} color='white' style={{ width: 30, height: 30}}/>
    } else {
      return subscribed ?
        this.renderBtn('star', subscribe) :
        this.renderBtn('star-o', subscribe)
    }
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

  renderBlur (playlist: IPlaylist) {
    const uri = playlist.coverImgUrl
    return (
      <Animated.Image source={{uri}} style={[styles.bg, this.blurTransform]}>
        <BlurView blurType='light' blurAmount={25} style={styles.blur} />
      </Animated.Image>
    )
  }

  renderPlayList = (isLoading: boolean, tracks: ITrack[]) => {
    return (
      <Animated.View style={[styles.playlistContainer, this.playlistTransform]}>
        <View style={{ height: height - Navbar.HEIGHT, backgroundColor: 'white'}}>
          <TrackList
            isLoading={isLoading}
            pid={this.props.route.id}
            tracks={tracks}
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
      playlist,
      isLoading,
      subscribing
    },
    player: {
      playing
    }
  }: {
      details: IDetailState,
      player: any
  },
  ownProps: IProps
) {
  const { route } = ownProps
  return {
    playlist: {
      ...route,
      ...playlist[route.id],
      creator: route.creator,
      coverImgUrl: route.coverImgUrl
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
      return dispatch(syncPlaylistDetail(ownProps.route.id))
    },
    subscribe () {
      return dispatch(subscribePlaylist(ownProps.route.id))
    },
    download (track: ITrack[]) {
      return dispatch(downloadTracksAction(track))
    }
  })
)(PlayList)
