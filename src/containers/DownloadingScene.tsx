import * as React from 'react'
import { connect } from 'react-redux'
import { ITrack } from '../services/api'
import {
  ScrollView,
  View,
  InteractionManager,
  ActivityIndicator,
  Alert
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
  progress: {
    [props: number]: any
  },
  remove: (id: number) => Redux.Action,
  stop: () => Redux.Action,
  clear: () => Redux.Action
}

class Downloading extends React.Component<IProps, { visable: boolean }> {

  constructor(props) {
    super(props)
    this.state = {
      visable: false
    }
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        visable: true
      })
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

  render() {
    const {
      tracks,
      progress,
      remove,
      stop
    } = this.props

    const rightConfig = {
      text: '清空',
      onPress: () => {
        this.clear()
      }
    }

    return (
      <View style={{ flex: 1 }}>
        <Navbar
          title='正在下载'
          textColor='#333'
          hideBorder={false}
          rightConfig={rightConfig}
        />
        <ScrollView>
          {this.state.visable ? tracks.map(track => <Items
            key={track.id}
            track={track}
            progress={progress[track.id]}
            remove={remove}
            failed={false}
            stop={stop}
          />) : <ActivityIndicator animating size='small' style={{ marginTop: 10 }} /> }
        </ScrollView>
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
    tracks: downloading,
    progress,
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
