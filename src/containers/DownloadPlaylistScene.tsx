import * as React from 'react'
import { ITrack } from '../services/api'
import {
  ListView,
  TouchableWithoutFeedback,
  View,
  Alert,
  ListViewDataSource
} from 'react-native'
import Navbar from '../components/navbar'
import ListItem from '../components/listitem'
import { get, isEqual } from 'lodash'
import { Color } from '../styles'
import Ionic from 'react-native-vector-icons/Ionicons'
import { connect } from 'react-redux'
import {
  popupTrackActionSheet,
  playTrackAction,
  clearDownloadAction,
  deleteDownloadTrack
} from '../actions'
import SwipeAction from 'antd-mobile/lib/swipe-action'
import { IPlaylistProps } from '../interfaces'

interface IProps extends IPlaylistProps {
  delete: (id: number) => Redux.Action,
  clear: () => Redux.Action
}

class Playlist extends React.Component<IProps, any> {
  private ds: ListViewDataSource

  constructor(props: IProps) {
    super(props)
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id})
  }

  componentWillReceiveProps (nextProps: IProps) {
    if (!isEqual(nextProps.playing, this.props.playing)) {
      this.ds = this.ds.cloneWithRows([])
    }
  }

  renderTrack = (playing, isPlaylist: boolean) => {
    return (track: ITrack, sectionId, rowId) => {
      const index = Number(rowId)
      const isPlaying = playing.index === index && isPlaylist
      const artistName = get(track, 'artists[0].name', null)
      const albumName = get(track, 'album.name', '')
      const subTitle = artistName ?
        `${artistName} - ${albumName}` :
        albumName
      const colorStyle = isPlaying && { color: Color.main }
      return <SwipeAction
        autoClose
        style={{ backgroundColor: 'white' }}
        right={[{
          text: '删除',
          onPress: this.delete(track.id),
          style: { backgroundColor: 'rgb(244, 51, 60)', color: 'white' }
        }]}
      >
        <ListItem
          title={track.name}
          containerStyle={{ paddingVertical: 0, paddingRight: 0 }}
          picURI={track.album.picUrl + '?param=75y75'}
          subTitle={subTitle}
          textContainer={{ paddingVertical: 10 }}
          picStyle={{ width: 40, height: 40}}
          titleStyle={[{ fontSize: 15 }, colorStyle]}
          subTitleStyle={colorStyle}
          onPress={!isPlaying ? this.listItemOnPress(index) : undefined}
          renderRight={
            <TouchableWithoutFeedback
              onPress={this.moreIconOnPress(track)}
            >
              <View style={{flexDirection: 'row', paddingRight: 10}}>
                {isPlaying && <View style={{ justifyContent: 'center' }}>
                  <Ionic size={22} name='md-volume-up' color={Color.main} style={{ paddingLeft: 10 }}/>
                </View>}
                <View style={{ justifyContent: 'center' }}>
                  <Ionic size={22} name='ios-more' color='#777' style={{ paddingLeft: 10 }}/>
                </View>
              </View>
            </TouchableWithoutFeedback>
          }
          key={track.id}
        />
      </SwipeAction>
    }
  }

  listItemOnPress = (id: number) => () => {
    this.props.play(id, this.props.tracks)
  }

  delete = (id: number) => () => {
    this.props.delete(id)
  }

  moreIconOnPress = (track: ITrack) => () => {
    this.props.popup(track)
  }

  clear = () => {
    Alert.alert(
      '',
      '确定清空所有吗？',
      [{
        text: '取消'
      }, {
        text: '确定',
        onPress: () => this.props.clear()
      }]
    )
  }

  render() {
    const {
      tracks,
      playing,
      isPlaylist
    } = this.props
    if (tracks) {
      this.ds = this.ds.cloneWithRows(tracks)
    }

    const rightConfig = {
      text: '清空',
      onPress: () => {
        this.clear()
      }
    }

    return (
      <View style={{flex: 1}}>
        <Navbar
          title='我的离线'
          textColor='#333'
          hideBorder={false}
          rightConfig={rightConfig}
        />
        <ListView
          enableEmptySections
          removeClippedSubviews={true}
          scrollRenderAheadDistance={120}
          initialListSize={20}
          dataSource={this.ds}
          renderRow={this.renderTrack(playing, isPlaylist)}
          showsVerticalScrollIndicator={true}
        />
      </View>
    )
  }

}

function mapStateToProps (
  {
    download: {
      tracks
    },
    player: {
      playing
    }
  }
) {
  return {
    tracks,
    playing,
    isPlaylist: playing.pid === 'download'
  }
}

export default connect(
  mapStateToProps,
  (dispatch) => ({
    clear() {
      return dispatch(clearDownloadAction())
    },
    delete(id: number) {
      return dispatch(deleteDownloadTrack(id))
    },
    popup(track: ITrack) {
      return dispatch(popupTrackActionSheet(track))
    },
    play(index: number, tracks: ITrack[]) {
      return dispatch(playTrackAction({
        playing: {
          index,
          pid: 'download'
        },
        playlist: tracks
      }))
    }
  })
)(Playlist)
