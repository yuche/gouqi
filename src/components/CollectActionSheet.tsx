import * as React from 'react'
import { IPlaylist, ITrack } from '../services/api'
import ListItem from '../components/listitem'
import { connect } from 'react-redux'
import {
  ScrollView,
  Dimensions,
  View,
  ViewStyle,
  Text
} from 'react-native'
import {
  hideCollectActionSheet,
  collectTrackToPlayliast,
  toCreatePlaylistAction
} from '../actions'
import PopupContainer from './PopupContainer'
import { centering, Color } from '../styles'
import Icon from 'react-native-vector-icons/Ionicons'
const { height } = Dimensions.get('window')

interface IProps {
  track: ITrack,
  created: IPlaylist[],
  visible: boolean,
  hide: () => Redux.Action,
  collect: (trackIds: number, pid: number) => Redux.Action,
  toCreatePlaylist: (trackId: number) => Redux.Action
}

class Collect extends React.Component<IProps, any> {

  constructor(props: IProps) {
    super(props)
  }

  render() {
    const {
      created,
      visible,
      track
    } = this.props
    return (
      <PopupContainer
        animationType='slide-up'
        visible={visible}
        onMaskClose={this.hide}
      >
        <View style={styles.container}>
          <View style={[{ backgroundColor: '#e2e3e4' }]}>
            <Text style={{ paddingVertical: 5, color: 'gray', fontSize: 13, paddingHorizontal: 10}}>
              收藏到歌单
            </Text>
          </View>
          <ScrollView showsVerticalScrollIndicator={true}>
            <ListItem
              title='新建歌单'
              renderLeft={
                <View style={styles.leftIcon}>
                  <Icon name='md-add' size={20} color={Color.main}/>
                </View>
              }
              onPress={this.toCreatePlaylist(track.id)}
            />
            {created.map(this.renderPlaylist)}
          </ScrollView>
        </View>
      </PopupContainer>
    )
  }

  hide = () => {
    this.props.hide()
  }

  toCreatePlaylist = (trackId: number) => {
    return () => this.props.toCreatePlaylist(trackId)
  }

  collect = (trackId: number, pid: number) => {
    return () => this.props.collect(trackId, pid)
  }

  renderPlaylist = (playlist: IPlaylist) => {
    const {
      track
    } = this.props
    return (
      <ListItem
        title={playlist.name}
        picURI={playlist.coverImgUrl + '?param=50y50'}
        subTitle={playlist.trackCount + ' 首'}
        key={playlist.id}
        onPress={this.collect(track.id, playlist.id)}
      />
    )
  }
}

const styles = {
  container: {
    maxHeight: Math.round(height * 3 / 5)
  } as ViewStyle,
  leftIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#e2e3e4',
    ...centering
  } as ViewStyle
}

export default connect(
  (
    {
      personal: {
        playlist: {
          created
        }
      },
      playlist: {
        track
      },
      ui: {
        popup: {
          collect: {
            visible
          }
        }
      }
    }
  ) => {
    return {
      created,
      track,
      visible
    }
  },
  (dispatch) => ({
    hide() {
      return dispatch(hideCollectActionSheet())
    },
    collect(trackIds: number, pid: number) {
      return dispatch(collectTrackToPlayliast({
        trackIds,
        pid
      }))
    },
    toCreatePlaylist(trackId: number) {
      return dispatch(toCreatePlaylistAction(trackId))
    }
  })
)(Collect)
