import * as React from 'react'
import {
  View,
  ViewStyle,
  Animated,
  Dimensions,
  Text,
  TextStyle
} from 'react-native'
import Lyric from '../components/Lyric'
import { IPlayerState } from '../reducers/player'
import { ITrack } from '../services/api'
import { connect } from 'react-redux'
import { centering } from '../styles'
import { get } from 'lodash'
import Icon from 'react-native-vector-icons/Ionicons'

const { height, width } = Dimensions.get('window')

interface IProps {
  visable: boolean,
  lyric: any[],
  currentTime: number,
  refreshing: boolean,
  track: ITrack,
  hide: () => any
}

class Lyrics extends React.Component<IProps, any> {

  private opacity: Animated.Value

  constructor (props) {
    super(props)
    this.opacity = new Animated.Value(0)
  }

  componentWillReceiveProps ({ visable }: IProps) {
    if (visable !== this.props.visable) {
      if (visable) {
        Animated.timing(this.opacity, { toValue: 1 }).start()
      } else {
        Animated.timing(this.opacity, { toValue: 0 }).start()
      }
    }
  }

  hide = () => {
    this.props.hide()
  }

  render () {
    const {
      visable,
      lyric,
      currentTime,
      refreshing,
      track
    } = this.props
    const trackName = get(track, 'name', '')
    const artistName = track
      && track.artists
      && track.artists.reduce((str, acc, index) => str + (index !== 0 ? ' & ' : '') + acc.name, '')
    const lineHeight = lyric.some((lrc) => lrc['translation']) ? 60 : 40
    if (!visable) {
      return null
    }
    return (
      <Animated.View style={[styles.frame, { opacity: this.opacity }]} pointerEvents='box-none'>
        <View style={styles.container}>
          <Lyric
            currentTime={currentTime}
            lyrics={lyric}
            refreshing={refreshing}
            lineHeight={lineHeight}
          />
          <View style={styles.info}>
            <Text numberOfLines={1} style={{marginHorizontal: 20}}>
              {trackName + ' / '}
              <Text style={{ color: '#ccc' }}>{artistName}</Text>
            </Text>
            <Icon name={'md-close'} size={20} color='#ccc' style={styles.close} onPress={this.hide} />
          </View>
        </View>
      </Animated.View>
    )
  }
}

const styles = {
  frame: {
    flex: 1,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 99999
  } as ViewStyle,
  container: {
    paddingTop: 24,
    height: height - 160 - 24,
    width,
    backgroundColor: 'rgba(255, 255, 255, 0.95)'
  } as ViewStyle,
  info: {
    backgroundColor: '#f5f5f5',
    height: 30,
    ...centering
  } as ViewStyle,
  close: {
    position: 'absolute',
    right: 20,
    zIndex: 999
  } as TextStyle
}

function mapStateToProps (
  {
    player: {
      playing: {
        index
      },
      playlist,
      lyrics,
      lyricsVisable,
      slideTime,
      loadingLyric
    }
  }: { player: IPlayerState }
) {
  const track = playlist[index]
  const lyric = track && track.id && lyrics[track.id]
  return {
    visable: lyricsVisable,
    currentTime: slideTime,
    refreshing: loadingLyric,
    track: track || {},
    lyric: lyric || []
  }
}

export default connect(
  mapStateToProps,
  (dispatch) => ({
    hide () {
      return dispatch({ type: 'player/lyric/hide' })
    }
  })
)(Lyrics)
