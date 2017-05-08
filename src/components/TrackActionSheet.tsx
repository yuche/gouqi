import * as React from 'react'
import {
  View,
  Text,
  ViewStyle,
  TouchableHighlight,
  Dimensions,
  InteractionManager
} from 'react-native'
import { centering } from '../styles'
import CustomIcon from '../components/icon'
import { ITrack } from '../services/api'
import { connect } from 'react-redux'
import {
  popupCollectActionSheet,
  hideTrackActionSheet,
  downloadTracksAction,
  shrinkPlayer
} from '../actions'
import Popup from './PopupContainer'
import Router from '../routers'

const { width } = Dimensions.get('window')

interface IProps {
  track: ITrack,
  visible: boolean,
  popup: () => Redux.Action,
  hide: () => Redux.Action,
  toComment: () => Redux.Action,
  download: (tracks) => Redux.Action,
  shrinkPlayer: () => Redux.Action
}

class PopupContent extends React.Component<IProps, any> {
  constructor(props: IProps) {
    super(props)
  }

  render () {
    const {
      visible,
      download,
      track
    } = this.props
    return (
      <Popup
        animationType='slide-up'
        onMaskClose={this.hide}
        visible={visible}
      >
        <View>
          <View style={styles.actionContainer}>
            {this.renderAction('收藏到歌单', 'collect', this.popup)}
            {this.renderAction('评论', 'comment', this.toComment)}
            {this.renderAction('下载', 'download', () => download(track))}
            {this.renderAction('艺术家', 'artist', () => this.toArtist(track.artists[0]))}
            {this.renderAction('专辑', 'album', () => this.toAlbum(track.album))}
          </View>
          <TouchableHighlight
            style={[centering, styles.footer]}
            underlayColor='#e7e7e7'
            onPress={this.hide}
          >
            <Text style={{ fontSize: 15}}>
              取消
            </Text>
          </TouchableHighlight>
        </View>
      </Popup>
    )
  }

  hide = () => {
    this.props.hide()
  }

  popup = () => {
    this.props.popup()
  }

  toComment = () => {
    this.props.shrinkPlayer()
    console.log('to comment')
    this.props.toComment()
  }

  toAlbum = (route) => {
    this.hide()
    this.props.shrinkPlayer()
    InteractionManager.runAfterInteractions(() => {
      Router.toAlbumDetail({ route })
    })
  }

  toArtist = (route) => {
    this.hide()
    this.props.shrinkPlayer()
    Router.toArtistsDetail({ route })
    // InteractionManager.runAfterInteractions(() => {
    //   Router.toArtistsDetail({ route })
    // })
  }

  renderAction (title: string, iconName: string, onPress?: any) {
    return (
      <TouchableHighlight
        style={styles.action}
        onPress={onPress}
        underlayColor='white'
      >
        <View style={centering}>
          <CustomIcon name={iconName} size={18}/>
          <Text style={{ color: '#bbb', paddingTop: 10}}>
            {title}
          </Text>
        </View>
      </TouchableHighlight>
    )
  }
}

const styles = {
  footer: {
    height: 40,
    backgroundColor: '#e7e7e7'
  } as ViewStyle,
  actionContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    flexWrap: 'wrap',
    paddingBottom: 25
  } as ViewStyle,
  action: {
    height: 70,
    paddingTop: 25,
    width: width / 4,
    alignItems: 'center'
  } as ViewStyle,
  btn: {
    height: 30,
    width: 30,
    ...centering
  } as ViewStyle
}

export default connect(
  (
    {
      playlist: {
        track
      },
      ui: {
        popup: {
          track: {
            visible
          }
        }
      }
    }: any
  ) => {
    return {
      track,
      visible
    }
  },
  (dispatch) => ({
    popup() {
      return dispatch(popupCollectActionSheet())
    },
    hide() {
      return dispatch(hideTrackActionSheet())
    },
    toComment() {
      return dispatch({type: 'playlists/router/comment'})
    },
    download(track) {
      return dispatch(downloadTracksAction([track]))
    },
    shrinkPlayer() {
      return dispatch(shrinkPlayer())
    }
  })
)(PopupContent)
