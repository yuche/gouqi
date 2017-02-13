import * as React from 'react'
import { IPlaylist, ITrack } from '../../services/api'
import {
  View,
  ViewStyle,
  Animated,
  ScrollView,
  ActivityIndicator,
  Text,
  TextStyle,
  Image,
  Dimensions,
  TouchableOpacity
} from 'react-native'
import Navbar from '../../components/navbar'
import { ILoadingProps } from '../../interfaces'
import { connect, Dispatch } from 'react-redux'
import { syncPlaylistDetail, subscribePlaylist } from '../../actions'
import ListItem from '../../components/listitem'
import {
  IinitialState as IDetailState
} from '../../reducers/detail'
import { get, isEmpty } from 'lodash'
// tslint:disable-next-line:no-var-requires
const { BlurView } = require('react-native-blur')
const { width, height } = Dimensions.get('window')
// tslint:disable-next-line
const Icon = require('react-native-vector-icons/FontAwesome')

interface IProps extends ILoadingProps {
  route: IPlaylist,
  playlist: IPlaylist,
  subscribing: boolean,
  subscribe: () => Redux.Action
}

interface IState {
  titleOpacity: number
  headerOpacity: number,
  subscribed: boolean,
  scrollY: Animated.Value
}

class PlayList extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props)
    this.state = {
      titleOpacity: 0,
      headerOpacity: 1,
      subscribed: false,
      scrollY: new Animated.Value(0)
    }
  }

  componentDidMount () {
    this.props.sync()
  }

  render () {
    const {
      isLoading,
      playlist
    } = this.props
    const {
      titleOpacity,
      headerOpacity
    } = this.state
    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        {this.renderBlur( playlist )}
        {this.renderNavbar(playlist, titleOpacity)}
        {this.renderHeader(playlist, headerOpacity)}
        {this.renderPlayList(isLoading, playlist.tracks || [])}
      </View>
    )
  }

  renderNavbar (playlist: IPlaylist, opacity: number ) {
    return (
      <Navbar
        title={playlist.name}
        style={styles.navbar}
        titleStyle={{ opacity }}
      />
    )
  }

  renderHeader ( playlist: IPlaylist, opacity: number ) {
    const uri = playlist.coverImgUrl
    const { creator } = playlist
    return (
      <View style={styles.headerContainer}>
        <Animated.View style={[styles.header, { opacity }]}>
          <View style={{ flexDirection: 'row'}}>
            <Image source={{uri}} style={styles.headerPic}/>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={[styles.white, { fontSize: 16 }]}>{playlist.name}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
                <Image source={{uri: creator.avatarUrl}} style={{ width: 25, height: 25, borderRadius: 12.5 }}/>
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
      commentCount
    } = playlist
    const {
      subscribing,
      subscribe
    } = this.props
    return (
      <View style={{ flexDirection: 'row', marginTop: 10}}>
        <View style={styles.btnContainer}>
          {this.rendeSubIcon(subscribed, subscribing, subscribe)}
          <Text style={{ color: 'white' }}>{subscribedCount}</Text>
        </View>
        <View style={styles.btnContainer}>
          {this.renderBtn('comment-o')}
          <Text style={{ color: 'white' }}>{commentCount}</Text>
        </View>
        <View style={styles.btnContainer}>
          {this.renderBtn('info-circle')}
        </View>
        <View style={styles.btnContainer}>
          {this.renderBtn('download')}
        </View>
      </View>
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

  renderBlur (playlist: IPlaylist) {
    const uri = playlist.coverImgUrl
    return (
      <Animated.Image source={{uri}} style={styles.bg}>
        <BlurView blurType='light' blurAmount={25} style={styles.blur} />
      </Animated.Image>
    )
  }

  renderTrack = (track: ITrack) => {
    const artistName = get(track, 'artists[0].name', null)
    const albumName = get(track, 'album.name', '')
    const subTitle = artistName ?
      `${artistName} - ${albumName}` :
      albumName
    return (
      <ListItem
        title={track.name}
        picURI={track.album.picUrl}
        subTitle={subTitle}
        picStyle={{ width: 30, height: 30 }}
        titleStyle={{ fontSize: 14 }}
        key={track.id}
      />
    )
  }

  renderPlayList = (
    isLoading: boolean,
    tracks: ITrack[]
  ) => {
    return isLoading ?
      <ActivityIndicator animating style={{marginTop: 15}}/> :
      <Animated.View style={styles.playlistContainer}>
        <ScrollView
          style={{ marginTop: 150 }}
          onScroll={Animated.event([{nativeEvent: {contentOffset: {y: this.state.scrollY}}}])}
          scrollEventThrottle={16}
        >
          <Animated.View>
            {tracks.map(this.renderTrack)}
          </Animated.View>
        </ScrollView>
      </Animated.View >
  }

  playlistOnScroll () {
    
  }

}

const styles = {
  headerContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    paddingTop: Navbar.HEIGHT,
    backgroundColor: 'rgba(0 ,0 , 0, .1)'
  } as ViewStyle,
  header: {
    paddingHorizontal: 16,
    flexDirection: 'column'
  } as ViewStyle,
  playlistContainer: {
    position: 'absolute',
    left: 0,
    top: Navbar.HEIGHT,
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
    }
  }: { details: IDetailState },
  ownProps: IProps
) {
  const { route } = ownProps
  return {
    playlist: {
      ...route,
      ...(isEmpty(route) ? {} : playlist[route.id])
    },
    isLoading,
    subscribing
  }
}

export default connect(
  mapStateToProps,
  (dispatch: Dispatch<Redux.Action>, ownProps: IProps) => ({
    sync() {
      return dispatch(syncPlaylistDetail(ownProps.route.id))
    },
    subscribe() {
      return dispatch(subscribePlaylist(ownProps.route.id))
    }
  })
)(PlayList)
