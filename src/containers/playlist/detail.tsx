import * as React from 'react'
import { IPlaylist, ITrack } from '../../services/api'
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
  TouchableWithoutFeedback,
  ListView,
  Alert
} from 'react-native'
import Navbar from '../../components/navbar'
import { ILoadingProps } from '../../interfaces'
import { connect } from 'react-redux'
import {
  syncPlaylistDetail,
  subscribePlaylist,
  popupTrackActionSheet,
  playTrackAction
} from '../../actions'
import ListItem from '../../components/listitem'
import {
  IinitialState as IDetailState
} from '../../reducers/detail'
import { get } from 'lodash'
import Router from '../../routers'
import ParallaxScroll from '../../components/ParallaxScroll'
import { Color } from '../../styles'
// tslint:disable-next-line:no-var-requires
const { BlurView } = require('react-native-blur')
// tslint:disable-next-line:no-var-requires
const Icon = require('react-native-vector-icons/FontAwesome')
// tslint:disable-next-line:no-var-requires
const Ionic = require('react-native-vector-icons/Ionicons')

const { width, height } = Dimensions.get('window')

interface IProps extends ILoadingProps {
  route: IPlaylist,
  playlist: IPlaylist,
  subscribing: boolean,
  playingTrack: number,
  subscribe: () => Redux.Action,
  popup: (track: ITrack) => Redux.Action,
  play: (playingTrack: number, tracks: ITrack[]) => Redux.Action
}

interface IState {
  scrollY: Animated.Value
}

const HEADER_HEIGHT = 160

class PlayList extends React.Component<IProps, IState> {
  private ds: React.ListViewDataSource
  private scrollComponent: any

  constructor(props: IProps) {
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
    if (nextProps.playingTrack !== this.props.playingTrack) {
      this.ds = this.ds.cloneWithRows([])
    }
  }

  render () {
    const {
      isLoading,
      playlist,
      playingTrack
    } = this.props
    const {
      scrollY
    } = this.state
    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        {this.renderBlur(playlist, scrollY)}
        {this.renderNavbar(playlist, scrollY)}
        {this.renderHeader(playlist, scrollY)}
        {this.renderPlayList(isLoading, scrollY, playlist.tracks || [], playingTrack)}
      </View>
    )
  }

  renderNavbar (playlist: IPlaylist, scrollY: Animated.Value ) {
    const opacity = scrollY.interpolate({
      inputRange: [0, 100, HEADER_HEIGHT],
      outputRange: [0, 0, 1]
    })
    return (
      <Navbar
        title={playlist.name}
        style={styles.navbar}
        titleStyle={{ opacity }}
      />
    )
  }

  renderHeader ( playlist: IPlaylist, scrollY: Animated.Value ) {
    const uri = playlist.coverImgUrl
    const { creator } = playlist
    const opacity = scrollY.interpolate({
      inputRange: [0, 50, HEADER_HEIGHT],
      outputRange: [1, 1, 0]
    })
    const avatarUrl = creator.avatarUrl + '?param=30y30'
    return (
      <View style={styles.headerContainer}>
        <Animated.View style={[styles.header, { opacity }]}>
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
          {this.renderBtn('comment-o', Router.toComment({ route: { id: commentThreadId, playlist } }))}
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
        text: '确定'
      }]
    )
  }

  rendeSubIcon = (
    subscribed: boolean,
    subscribing: boolean,
    subscribe: () => Redux.Action
  ) => {
    if (subscribing) {
      return <ActivityIndicator animating color='white' style={{ width: 30, height: 30}}/>
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

  renderBlur (playlist: IPlaylist, scrollY: Animated.Value) {
    const uri = playlist.coverImgUrl
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

  renderTrack = (playingTrack: number) => {
    return (track: ITrack) => {
      const isPlaying = playingTrack === track.id
      const artistName = get(track, 'artists[0].name', null)
      const albumName = get(track, 'album.name', '')
      const subTitle = artistName ?
        `${artistName} - ${albumName}` :
        albumName
      const colorStyle = isPlaying && { color: Color.main }
      return <ListItem
        title={track.name}
        picURI={track.album.picUrl + '?param=75y75'}
        subTitle={subTitle}
        picStyle={{ width: 30, height: 30 }}
        titleStyle={[{ fontSize: 14 }, colorStyle]}
        subTitleStyle={colorStyle}
        onPress={!isPlaying ? this.listItemOnPress(track.id) : undefined}
        // tslint:disable-next-line:jsx-no-multiline-js
        renderRight={
          <TouchableWithoutFeedback
            style={{ justifyContent: 'center'}}
            onPress={this.moreIconOnPress(track)}
          >
            <View style={{flexDirection: 'row' }}>
            {isPlaying && <Ionic size={22} name='md-volume-up' color={Color.main} style={{ paddingLeft: 10 }}/>}
            <Ionic size={22} name='ios-more' color='#777' style={{ paddingLeft: 10 }}/>
            </View>
          </TouchableWithoutFeedback>
        }
        key={track.id}
      />
    }
  }

  listItemOnPress = (id: number) => () => {
    this.props.play(id, this.props.playlist.tracks)
  }

  moreIconOnPress = (track: ITrack) => () => {
    this.props.popup(track)
  }

  renderPlayList = (
    isLoading: boolean,
    scrollY: Animated.Value,
    tracks: ITrack[],
    playingTrack: number
  ) => {
    const containerY = scrollY.interpolate({
      inputRange: [0 , HEADER_HEIGHT, HEADER_HEIGHT],
      outputRange: [0, -HEADER_HEIGHT, -HEADER_HEIGHT]
    })
    if (tracks) {
      this.ds = this.ds.cloneWithRows(tracks)
    }
    return (
      <Animated.View style={[styles.playlistContainer, { transform: [{ translateY: containerY }] }]}>
        <View style={{ height: height - Navbar.HEIGHT, backgroundColor: 'white'}}>
          <ListView
            enableEmptySections
            removeClippedSubviews={true}
            scrollRenderAheadDistance={120}
            initialListSize={20}
            dataSource={this.ds}
            renderRow={this.renderTrack(playingTrack)}
            showsVerticalScrollIndicator={true}
            renderScrollComponent={this.renderScrollComponent(isLoading)}
          />
        </View>
      </Animated.View>
    )
  }

  renderScrollComponent = (isLoading: boolean) => {
    return (props: React.ScrollViewProperties) => (
      <ParallaxScroll
        {...props}
        onScroll={props.onScroll}
        isLoading={isLoading}
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
    width: 100,
    height: 100,
    resizeMode: 'cover'
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
      playingTrack
    }
  }: {
      details: IDetailState,
      player: {
        playingTrack: number
      }
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
    playingTrack,
    isLoading,
    subscribing
  }
}

export default connect(
  mapStateToProps,
  (dispatch, ownProps: IProps) => ({
    sync() {
      return dispatch(syncPlaylistDetail(ownProps.route.id))
    },
    subscribe() {
      return dispatch(subscribePlaylist(ownProps.route.id))
    },
    popup(track: ITrack) {
      return dispatch(popupTrackActionSheet(track))
    },
    play (playingTrack: number, tracks: ITrack[]) {
      return dispatch(playTrackAction({
        playingTrack,
        playlist: tracks
      }))
    }
  })
)(PlayList)
