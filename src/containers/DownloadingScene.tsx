import * as React from 'react'
import { connect } from 'react-redux'
import { ITrack } from '../services/api'
import {
  View,
  Alert,
  ListView,
  ListViewDataSource
} from 'react-native'
import {
  removeDownloadingItem,
  stopCurrentDownload,
  clearDownloading
} from '../actions'
import Items from '../components/DownloadingItem'
import Navbar from '../components/navbar'

interface IProps {
  tracks: ITrack[],
  failed: ITrack[],
  remove: (id: number) => Redux.Action,
  stop: () => Redux.Action,
  clear: () => Redux.Action
}

class Downloading extends React.Component<IProps, { visable: boolean }> {

  private rightConfig = {
    text: '清空',
    onPress: () => {
      this.clear()
    }
  }

  private ds: ListViewDataSource

  constructor(props) {
    super(props)
    this.ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1.id !== r2.id || r1.progress !== r2.progress
    })
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

  renderTrack = (stop, remove ) => {
    return (track) => (
      <Items
        key={track.id}
        track={track}
        progress={track.progress}
        remove={remove}
        failed={false}
        stop={stop}
      />
    )
  }

  render() {
    const {
      tracks,
      remove,
      stop
    } = this.props
    this.ds = this.ds.cloneWithRows(tracks)
    return (
      <View style={{ flex: 1 }}>
        <Navbar
          title='正在下载'
          textColor='#333'
          hideBorder={false}
          rightConfig={this.rightConfig}
        />
        <ListView
          enableEmptySections
          removeClippedSubviews={true}
          scrollRenderAheadDistance={90}
          initialListSize={15}
          dataSource={this.ds}
          renderRow={this.renderTrack(stop, remove)}
          showsVerticalScrollIndicator={true}
        />
      </View>
    )
  }
}

function mapStateToProps ({
  download: {
    downloading,
    progress,
    failed
  }
}) {
  return {
    tracks: downloading.map(track => ({
      ...track,
      progress: progress[track.id]
    })),
    failed
  }
}

export default connect(
  mapStateToProps,
  (dispatch) => ({
    remove(id: number) {
      return dispatch(removeDownloadingItem(id))
    },
    clear() {
      return dispatch(clearDownloading())
    },
    stop() {
      return dispatch(stopCurrentDownload())
    }
  })
)(Downloading)
