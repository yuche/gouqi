import * as React from 'react'
import * as api from '../../services/api'
import {
  View,
  ViewStyle,
  Animated,
  ScrollView,
  ActivityIndicator,
  Text,
  TextStyle,
  Image,
  Dimensions
} from 'react-native'
import Navbar from '../../components/navbar'
import { ILoadingProps } from '../../interfaces'
import { connect, Dispatch } from 'react-redux'
import { syncPlaylistDetail } from '../../actions'
import ListItem from '../../components/listitem'
import {
  IinitialState as IDetailState
} from '../../reducers/detail'
import { get } from 'lodash'
// tslint:disable-next-line:no-var-requires
const { BlurView } = require('react-native-blur')
const { width, height } = Dimensions.get('window')

interface IProps extends ILoadingProps {
  route: api.IPlaylist,
  tracks: api.ITrack[]
}

interface IState {
  titleOpacity: number
  headerOpacity: number
}

class PlayList extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props)
    this.state = {
      titleOpacity: 0,
      headerOpacity: 1
    }
  }

  componentDidMount () {
    this.props.sync()
  }

  render () {
    const {
      route,
      isLoading,
      tracks
    } = this.props
    const {
      titleOpacity,
      headerOpacity
    } = this.state
    return (
      <View style={{flex: 1, backgroundColor: '#f3f3f3'}}>
        {this.renderBlur( route )}
        {this.renderNavbar(route, titleOpacity)}
        {this.renderHeader(route, headerOpacity)}
        {/*{this.renderPlayList(isLoading, tracks)}*/}
      </View>
    )
  }

  renderNavbar (playlist: api.IPlaylist, opacity: number ) {
    return (
      <Navbar
        title={playlist.name}
        style={styles.navbar}
        titleStyle={{ opacity }}
      />
    )
  }

  renderHeader ( playlist: api.IPlaylist, opacity: number ) {
    const uri = playlist.coverImgUrl
    const { creator } = playlist
    return (
      <View style={styles.headerContainer}>
        <Animated.View style={[styles.header, { opacity }]}>
          <View style={{ flexDirection: 'row' }}>
            <Image source={{uri}} style={styles.headerPic}/>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={[styles.white, { fontSize: 16 }]}>{playlist.name}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
                <Image source={{uri: creator.avatarUrl}} style={{ width: 25, height: 25, borderRadius: 12.5 }}/>
                <Text style={[styles.white, { marginLeft: 5 }]}>{creator.nickname}</Text>
              </View>
            </View>
            {this.renderActions()}
          </View>
        </Animated.View>
      </View>
    )
  }

  renderActions = () => {
    return (
      <View style={{ flexDirection: 'row'}}>

      </View>
    )
  }

  renderBlur (playlist: api.IPlaylist) {
    const uri = playlist.coverImgUrl
    return (
      <Animated.Image source={{uri}} style={styles.bg}>
          <BlurView blurType='light' blurAmount={25} style={styles.blur} />
      </Animated.Image>
    )
  }

  renderTrack = (track: api.ITrack) => {
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
        titleStyle={{ fontSize: 13 }}
        key={track.id}
      />
    )
  }

  renderPlayList = (
    isLoading: boolean,
    tracks: api.ITrack[]
  ) => {
    return isLoading ?
      <ActivityIndicator animating style={{marginTop: 20}}/> :
      <ScrollView>
        {tracks.map(this.renderTrack)}
      </ScrollView>
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
    backgroundColor: 'rgba(0 ,0 , 0, .3)'
  } as ViewStyle,
  header: {
    paddingHorizontal: 16,
    flexDirection: 'column'
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
  } as ViewStyle
}

function mapStateToProps (
  {
    details: {
      playlist
    }
  }: { details: IDetailState },
  ownProps: IProps
) {
  const { id } = ownProps.route
  return {
    tracks: playlist[id] || []
  }
}

export default connect(
  mapStateToProps,
  (dispatch: Dispatch<Redux.Action>, ownProps: IProps) => ({
    sync() {
      return dispatch(syncPlaylistDetail(ownProps.route.id))
    }
  })
)(PlayList)
