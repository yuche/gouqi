import * as React from 'react'
import { IPlayerProps as IProps } from '../interfaces'
import Player from '../components/player'
import { connect } from 'react-redux'
import { IPlayerState, IPlayerStatus } from '../reducers/player'
import {
  changeStatusAction,
  nextTrackAction,
  prevTrackAction
} from '../actions'
import {
  View,
  ViewStyle,
  StyleSheet,
  Image,
  Text,
  TextStyle,
  TouchableOpacity
} from 'react-native'
import { centering, Color } from '../styles'
import { get } from 'lodash'
// tslint:disable-next-line:no-var-requires
const Icon = require('react-native-vector-icons/FontAwesome')
import { emitter } from '../utils'

class PlayerContainer extends React.Component<IProps, any> {

  constructor(props: IProps) {
    super(props)
  }

  componentDidMount () {
  }

  render () {
    const {
      track
    } = this.props
    const picUrl = get(track, 'album.picUrl', '')
    const trackName = get(track, 'name', '')
    const albumName = get(track, 'album.name', '')
    return (
      <View style={styles.container}>
        <Player {...this.props}/>
        <View style={styles.wrapper}>
          {this.renderImage(picUrl)}
          {this.renderText(trackName, albumName)}
        </View>
      </View>
    )
  }

  renderImage = (picUrl: string) => {
    const uri = picUrl || ''
    return (
      <View style={centering}>
        <Image
          source={{ uri }}
          resizeMode='contain'
          style={[styles.component, { borderRadius: 20 }]}
        />
      </View>
    )
  }

  renderText = (title: string, subtitle: string) => {
    return (
      <View style={styles.titleContainer}>
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
      </View>
    )
  }

  renderBtns = () => {
    const {
      status
    } = this.props
    const playIcon = () => {
      return status === 'PLAYING'
        ? <Icon name='pause-circle-o' size={25} color='#eee'/>
        : <Icon name='play-circle-o' size={25} color='#eee'/>
    }
    return (
      <View style={{ flexDirection: 'column' }}>
        <TouchableOpacity style={[styles.btn, styles.component]} onPress={this.changeStatus}>
          {playIcon()}
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.component]} onPress={this.nextTrack}>
          <Icon name='step-forward' size={25} color='#eee'/>
        </TouchableOpacity>
      </View>
    )
  }

  changeStatus = () => {
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
    padding: 10,
    borderTopColor: '#ededed',
    backgroundColor: 'white',
    borderTopWidth: StyleSheet.hairlineWidth
  } as ViewStyle,
  wrapper: {
    flex: 1,
    flexDirection: 'row'
  } as ViewStyle,
  component: {
    width: 40,
    height: 40
  } as ViewStyle,
  titleContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between'
  } as ViewStyle,
  btn: {
    ...centering,
    marginLeft: 10
  } as ViewStyle,
  title: {
    marginLeft: 10,
    fontSize: 14
  } as TextStyle,
  subtitle: {
    marginLeft: 10,
    fontSize: 14
  } as TextStyle
}

function mapStateToProps (
  {
    player: {
      playlist,
      playingTrack,
      status,
      mode
    }
  }: { player: IPlayerState }
) {
  const track = playlist.find(t => t.id === playingTrack)
  return {
    mode,
    status,
    track
  }
}

export default connect(
  mapStateToProps,
  (dispatch) => ({
    prev() {
      return dispatch(prevTrackAction())
    },
    next() {
      return dispatch(nextTrackAction())
    },
    changeStatus(status: IPlayerStatus) {
      return dispatch(changeStatusAction(status))
    }
  })
)(PlayerContainer)


