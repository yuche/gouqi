import * as React from 'react'
import { IPlayerProps as IProps } from '../interfaces'
import Player from '../components/player'
import { connect } from 'react-redux'
import { IPlayerState, IPlayerStatus } from '../reducers/player'
import {
  changeStatusAction,
  nextTrackAction,
  prevTrackAction,
  currentTimeAction,
  durationAction,
  downloadTracksAction,
  popupTrackActionSheet,
  setModeAction,
  toastAction
} from '../actions'
import {
  View,
  ViewStyle,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  Dimensions,
  Animated,
  TouchableWithoutFeedback
} from 'react-native'
import { centering, Color } from '../styles'
import { get } from 'lodash'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Interactable from 'react-native-interactable'
import Navbar from '../components/navbar'
import CustomIcon from '../components/icon'
import FaIcon from 'react-native-vector-icons/FontAwesome'
import Slider from '../components/Slider'
const { width, height } = Dimensions.get('window')

const VIEW_POSITION_Y = height - Navbar.HEIGHT - Navbar.HEIGHT

function padding(num: number) {
  return num < 10 ? '0' + num : num
}

function formatTime(time: number) {
  const min = Math.floor(time / 60)
  const sec = time % 60
  return `${padding(min)}:${padding(sec)}`
}

class PlayerContainer extends React.Component<IProps, any> {

  private deltaY: Animated.Value

  private imageAnimation: any

  private Interactable: any

  private bodyAnimation: any

  private tabbarAnimation: any

  constructor(props: IProps) {
    super(props)
    this.deltaY = new Animated.Value(0)
    const imageWidth = this.deltaY.interpolate({
      inputRange: [-VIEW_POSITION_Y, 0, 0],
      outputRange: [200, 40, 40]
    })
    this.imageAnimation = {
      width: imageWidth,
      height: imageWidth,
      borderRadius: imageWidth.interpolate({
        inputRange: [40, 200, 200],
        outputRange: [20, 100, 100]
      }),
      transform: [{
        translateX: this.deltaY.interpolate({
          inputRange: [-VIEW_POSITION_Y, 0, 0],
          outputRange: [(width - 200) / 2 + 70, 0, 0]
        })
      }, {
        translateY: this.deltaY.interpolate({
          inputRange: [-VIEW_POSITION_Y, 0, 0],
          outputRange: [90, 0, 0]
        })
      }]
    }
    this.tabbarAnimation = {
      opacity: this.deltaY.interpolate({
        inputRange: [-VIEW_POSITION_Y, -100, 0],
        outputRange: [0, 0, 1]
      })
    }
    this.bodyAnimation = {
      opacity: this.deltaY.interpolate({
        inputRange: [-VIEW_POSITION_Y, -VIEW_POSITION_Y + 100, 0],
        outputRange: [1, 0.25, 0],
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp'
      })
    }
  }

  mapInteractable = component => (this.Interactable = component)

  expand = () => (this.Interactable.snapTo({ index: 1 }))

  render () {
    const {
      track,
      status,
      mode,
      duration,
      currentTime
    } = this.props
    const picUrl = get(track, 'album.picUrl', '')
    const trackName = get(track, 'name', '')
    const albumName = get(track, 'album.name', '')
    const artistName = track
      && track.artists
      && track.artists.reduce((str, acc, index) => str + (index !== 0 ? ' & ' : '') + acc.name, '')
    return (
      <View style={styles.container}>
        <Player {...this.props} />
        <Interactable.View
          ref={this.mapInteractable}
          verticalOnly={true}
          snapPoints={[{ y: 0 }, { y: -VIEW_POSITION_Y }]}
          boundaries={{ bottom: 0, top: -VIEW_POSITION_Y, bounce: .5, haptics: true }}
          animatedValueY={this.deltaY}
        >
          <View style={styles.wrapper}>
            <TouchableWithoutFeedback onPress={this.expand}>
              <View style={styles.tabbar}>
                {this.renderImage(picUrl)}
                {this.renderTabbarText(trackName, albumName)}
                {this.renderTabbarBtns(status)}
              </View>
            </TouchableWithoutFeedback>
            <Animated.View style={[styles.body, this.bodyAnimation]}>
              {this.renderBodyText(trackName, artistName)}
              {this.renderTrackActions()}
              {this.renderSlider(duration, currentTime)}
              {this.renderPlayerActions(status, mode)}
            </Animated.View>
          </View>
        </Interactable.View>
      </View>
    )
  }

  renderImage = (picUrl: string) => {
    const uri = picUrl || 'http://p4.music.126.net/YhnGyy3LtMFhoCvDI59JNA==/2589349883413112.jpg'
    return (
      <View style={[centering, { height: 60, width: 60 }]}>
        <Animated.Image
          source={{ uri }}
          resizeMode='contain'
          style={[styles.component, this.imageAnimation]}
        />
      </View>
    )
  }

  renderSlider = (duration, currentTime) => {
    const value = Math.floor((currentTime / duration) * 100)
    return (
      <View style={{ height: 50, flexDirection: 'row', alignItems: 'center' }}>
        <Slider
          style={{ width: width - 40, marginHorizontal: 20 }}
          maximumValue={100}
          minimumTrackTintColor={Color.main}
          maximumTrackTintColor='#d3d3d3'
          thumbTintColor={Color.main}
          value={0}
        />
      </View>
    )
  }

  renderPlayerActions = (status, mode) => {
    return (
      <View style={[{ height: 120, flexDirection: 'row' ,...centering }]}>
        {this.renderMode(mode)}
        <View style={styles.playActions}>
          <Icon name='skip-previous' size={50} color='#ccc' onPress={this.prevTrack}/>
          {status === 'PLAYING'
            ? <Icon name='pause-circle-outline' size={50} color='#ccc' onPress={this.togglePlayPause}/>
            : <Icon name='play-circle-outline' size={50} color='#ccc' onPress={this.togglePlayPause}/>}
          <Icon name='skip-next' size={50} color='#ccc' onPress={this.nextTrack}/>
        </View>
        <FaIcon size={20} style={styles.trackAction} name='list-ul' color='#ccc' onPress={this.popup}/>
      </View>
    )
  }

  popup = () => (this.props.popup())

  renderMode = (mode) => {
    return (
      mode === 'SEQUE'
        ? <CustomIcon size={22} style={styles.trackAction} name='seque' color='#ccc' onPress={this.setMode('RANDOM')}/>
        : mode === 'RANDOM'
          // tslint:disable-next-line:max-line-length
          ? <CustomIcon size={22} style={styles.trackAction} name='random' color='#ccc' onPress={this.setMode('REPEAT')}/>
          : <CustomIcon size={22} style={styles.trackAction} name='seque1' color='#ccc' onPress={this.setMode('SEQUE')} />
    )
  }

  setMode = (mode) => () => this.props.setMode(mode)

  renderTrackActions = () => {
    return (
      <View style={styles.trackActions}>
        <CustomIcon size={22} style={styles.trackAction} name='ci' color='#ccc' />
        <CustomIcon size={22} style={styles.trackAction} name='download' color='#ccc' />
        <CustomIcon size={22} style={styles.trackAction} name='more' color='#ccc' />
      </View>
    )
  }

  renderTabbarText = (title: string, subtitle: string) => {
    return (
      <Animated.View style={[styles.titleContainer, this.tabbarAnimation]}>
        <View>
          <Text style={styles.title}  numberOfLines={1}>
            {title}
          </Text>
        </View>
        <View>
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        </View>
      </Animated.View>
    )
  }

  renderBodyText = (title = 'Tribute', subtitle = 'John Newman') => {
    return (
      <View style={{ alignItems: 'center', flex: 1, width}}>
        <Text style={{ fontSize: 22, marginBottom: 5 }} numberOfLines={1}>
          {'fuckyou'}
        </Text>
        <Text style={{ fontSize: 15, color: '#ccc' }} numberOfLines={1}>
          {subtitle}
        </Text>
      </View>
    )
  }

  renderTabbarBtns = (status) => {
    return (
      <Animated.View style={[styles.btns, this.tabbarAnimation]}>
        <TouchableOpacity style={[styles.component, styles.btn]} onPress={this.togglePlayPause}>
          {status === 'PLAYING'
            ? <Icon name='pause-circle-outline' size={32} color='#ccc' />
            : <Icon name='play-circle-outline' size={32} color='#ccc' />}
        </TouchableOpacity>
        <TouchableOpacity style={[styles.component, styles.btn]} onPress={this.nextTrack}>
          <Icon name='skip-next' size={32} color='#ccc'/>
        </TouchableOpacity>
      </Animated.View>
    )
  }

  togglePlayPause = () => {
    const { status } = this.props
    if (status === 'PLAYING') {
      this.props.changeStatus('PAUSED')
    } else {
      this.props.changeStatus('PLAYING')
    }
  }

  prevTrack = () => {
    this.props.prev()
  }

  nextTrack = () => {
    this.props.next()
  }

}

const styles = {
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: height - 60,
    bottom: 0,
    flexDirection: 'column'
  } as ViewStyle,
  tabbar: {
    height: 60,
    position: 'absolute',
    top: 0,
    flexDirection: 'row',
    width
  } as ViewStyle,
  absolute: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  } as ViewStyle,
  modal: {
    height,
    backgroundColor: 'black',
    opacity: 0.6,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  wrapper: {
    borderTopColor: '#ededed',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopWidth: StyleSheet.hairlineWidth,
    height: height - Navbar.HEIGHT,
    flexDirection: 'row'
  } as ViewStyle,
  component: {
    width: 40,
    height: 40
  } as ViewStyle,
  titleContainer: {
    flex: 1,
    height: 60,
    justifyContent: 'center',
    flexDirection: 'column'
  } as ViewStyle,
  btns: {
    height: 60,
    flexDirection: 'row'
  } as ViewStyle,
  btn: {
    ...centering,
    height: 60,
    marginLeft: 10
  } as ViewStyle,
  title: {
    marginLeft: 10,
    marginBottom: 5,
    fontSize: 14
  } as TextStyle,
  subtitle: {
    marginLeft: 10,
    fontSize: 12,
    color: '#777'
  } as TextStyle,
  trackActions: {
    flexDirection: 'row',
    flex: 1,
    ...centering
  } as ViewStyle,
  trackAction: {
    marginHorizontal: 20
  } as TextStyle,
  playActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flex: 1
  } as ViewStyle,
  body: {
    marginTop: 260,
    flex: 1,
    flexDirection: 'column',
    ...centering
  } as ViewStyle
}

function mapStateToProps (
  {
    player: {
      playlist,
      playing: {
        index
      },
      status,
      mode,
      uri,
      duration,
      currentTime
    }
  }: { player: IPlayerState }
) {
  const track = playlist[index]
  return {
    mode,
    status,
    track: track || {},
    uri,
    duration,
    currentTime
  }
}

export default connect(
  mapStateToProps,
  (dispatch, ownProps: any) => ({
    prev() {
      return dispatch(prevTrackAction())
    },
    next() {
      return dispatch(nextTrackAction())
    },
    changeStatus(status: IPlayerStatus) {
      return dispatch(changeStatusAction(status))
    },
    setCurrentTime(currentTime) {
      return dispatch(currentTimeAction(currentTime))
    },
    setDuration(duration) {
      return dispatch(durationAction(duration))
    },
    popup() {
      return dispatch(popupTrackActionSheet(ownProps.track))
    },
    setMode(mode) {
      let modeStr
      if (mode === 'SEQUE') {
        modeStr = '顺序播放'
      } else if (mode === 'RANDOM') {
        modeStr = '随机播放'
      } else {
        modeStr = '单曲循环'
      }
      dispatch(toastAction('info', `开始${modeStr}`))
      return dispatch(setModeAction(mode))
    },
    download() {
      return dispatch(downloadTracksAction([ownProps.track]))
    }
  })
)(PlayerContainer)
