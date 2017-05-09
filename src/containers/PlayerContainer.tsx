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
  toastAction,
  toggleSlide,
  slideTimeAction
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
import { get, isEmpty } from 'lodash'
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

function formatTime(time = 0) {
  const min = Math.floor(time / 60)
  const sec = Math.floor(time % 60)
  return `${padding(min)}:${padding(sec)}`
}

class PlayerContainer extends React.Component<IProps, any> {

  private deltaY: Animated.Value

  private imageAnimation: any

  private Interactable: any

  private bodyAnimation: any

  private tabbarAnimation: any

  private Player: any

  private translateY: Animated.Value

  constructor(props: IProps) {
    super(props)
    this.deltaY = new Animated.Value(0)
    this.translateY = new Animated.Value(60)
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

  componentWillReceiveProps(nextProps: IProps) {
    if (nextProps.visable !== this.props.visable) {
      if (nextProps.visable) {
        Animated.timing(this.translateY, { toValue: 0 }).start()
      } else {
        Animated.timing(this.translateY, { toValue: 60 }).start()
      }
    }

    if (nextProps.shrink !== this.props.shrink) {
      this.shrink()
    }
  }

  mapInteractable = (component) => (this.Interactable = component)

  expand = () => (this.Interactable.snapTo({ index: 1 }))

  shrink = () => (this.Interactable.snapTo({ index: 0 }))

  mapPlayer = (component) => (this.Player = component)

  render() {
    const {
      track,
      status,
      mode,
      duration,
      slideTime
    } = this.props
    const picUrl = get(track, 'album.picUrl', '')
    const trackName = get(track, 'name', '')
    const artistName = track
      && track.artists
      && track.artists.reduce((str, acc, index) => str + (index !== 0 ? ' & ' : '') + acc.name, '')
    return (
      <Animated.View style={[styles.container, {transform: [{translateY: this.translateY}]}]}>
        <Player {...this.props} ref={this.mapPlayer}/>
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
                {this.renderTabbarText(trackName, artistName)}
                {this.renderTabbarBtns(status)}
              </View>
            </TouchableWithoutFeedback>
            <Animated.View style={[styles.body, this.bodyAnimation]}>
              {this.renderBodyText(trackName, artistName)}
              {this.renderTrackActions()}
              {this.renderSlider(duration, slideTime)}
              {this.renderPlayerActions(status, mode)}
            </Animated.View>
          </View>
        </Interactable.View>
      </Animated.View>
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
    const value = parseFloat(((currentTime / duration) * 100 || 0).toFixed(2))
    const isValid = duration && currentTime && (duration - currentTime > 0)
    return (
      <View style={styles.slider}>
        <Slider
          style={{ width: width - 40, marginHorizontal: 20, height: 30}}
          maximumValue={100}
          minimumTrackTintColor={Color.main}
          maximumTrackTintColor='#d3d3d3'
          trackStyle={{ height: 2, borderRadius: 1 }}
          thumbStyle={{height: 16, width: 16, borderRadius: 8}}
          thumbTintColor={Color.main}
          onSlidingStart={this.onSlidingStart}
          onSlidingComplete={this.onSlidingComplete}
          onValueChange={this.onValueChange}
          value={value >= 100 ? 100 : value}
        />
        <View style={styles.time}>
          <Text style={{ color: '#ccc' }}>{formatTime(isValid ? currentTime : 0)}</Text>
          <Text style={{ color: '#ccc' }}>{formatTime(isValid ? duration - currentTime : 0)}</Text>
        </View>
      </View>
    )
  }

  onValueChange = (value) => {
    const time = Math.floor(this.props.duration * (value / 100))
    this.props.setSlideTime(time)
  }

  onSlidingStart = (value) => {
    this.props.toggleSlide(true)
  }

  onSlidingComplete = (value) => {
    this.props.toggleSlide(false)
    this.Player.audio.seek(Math.floor(this.props.duration * (value / 100)))
  }

  renderPlayerActions = (status, mode) => {
    return (
      <View style={[{ height: 100, flexDirection: 'row' , ...centering }]}>
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

  popup = () => (this.props.popup(this.props.track))

  renderMode = (mode) => {
    return (
      mode === 'SEQUE'
        // tslint:disable-next-line:max-line-length
        ? <CustomIcon size={22} style={styles.orderAction()} name='seque' color='#ccc' onPress={this.setMode('RANDOM')}/>
        : mode === 'RANDOM'
          // tslint:disable-next-line:max-line-length
          ? <CustomIcon size={22} style={styles.orderAction()} name='random' color='#ccc' onPress={this.setMode('REPEAT')}/>
          : <CustomIcon size={22} style={styles.orderAction()} name='seque1' color='#ccc' onPress={this.setMode('SEQUE')} />
    )
  }

  setMode = (mode) => () => this.props.setMode(mode)

  renderTrackActions = () => {
    return (
      <View style={styles.trackActions}>
        <CustomIcon size={22} style={styles.trackAction} name='ci' color='#ccc' />
        <CustomIcon size={22} style={styles.trackAction} name='download' color='#ccc' onPress={this.download}/>
        <CustomIcon size={22} style={styles.trackAction} name='more' color='#ccc' onPress={this.popup}/>
      </View>
    )
  }

  download = () => (this.props.download(this.props.track))

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

  renderBodyText = (title: string, subtitle: string) => {
    return (
      <View style={{ ...centering, flex: 1, width, marginHorizontal: 20}}>
        <Text style={{ fontSize: 22, marginBottom: 5 }} numberOfLines={1}>
          {title}
        </Text>
        <Text style={{ fontSize: 16, color: '#ccc' }} numberOfLines={1}>
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
    flexDirection: 'row',
    shadowColor: '#000000',
    shadowOpacity: 0.4
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
    marginBottom: 5,
    fontSize: 14
  } as TextStyle,
  subtitle: {
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
  } as ViewStyle,
  slider: {
    height: 60,
    ...centering
  } as ViewStyle,
  orderAction() {
    return {
      ...this.trackAction,
      position: 'relative',
      top: 2
    }
  },
  time: {
    width: width - 40,
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between'
  } as ViewStyle
}

function mapStateToProps(
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
      currentTime,
      slideTime,
      isSliding,
      shrink
    }
  }: { player: IPlayerState }
) {
  const track = playlist[index]
  return {
    mode,
    status,
    track: track || {},
    uri,
    shrink,
    visable: !isEmpty(playlist),
    duration,
    currentTime,
    slideTime,
    isSliding
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
    setSlideTime(time) {
      return dispatch(slideTimeAction(time))
    },
    toggleSlide(bool) {
      return dispatch(toggleSlide(bool))
    },
    setDuration(duration) {
      return dispatch(durationAction(duration))
    },
    popup(track) {
      return dispatch(popupTrackActionSheet(track))
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
    download(track) {
      return dispatch(downloadTracksAction([track]))
    }
  })
)(PlayerContainer)
