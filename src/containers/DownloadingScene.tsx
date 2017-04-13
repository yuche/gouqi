import * as React from 'react'
import { connect } from 'react-redux'
import { ITrack } from '../services/api'
import {
  ScrollView,
  View,
  InteractionManager,
  ActivityIndicator
} from 'react-native'
import { removeDownloadingItem } from '../actions'
import Items from '../components/DownloadingItem'
import Navbar from '../components/navbar'

interface IProps {
  tracks: ITrack[],
  failed: ITrack[],
  progress: {
    [props: number]: any
  },
  remove: (id: number) => Redux.Action
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

  render() {
    const {
      tracks,
      progress,
      remove
    } = this.props
    return (
      <View style={{ flex: 1 }}>
        <Navbar
          title='正在下载'
          textColor='#333'
          hideBorder={false}
        />
        <ScrollView>
          {this.state.visable ? tracks.map(track => <Items
            key={track.id}
            track={track}
            progress={progress[track.id]}
            remove={remove}
            failed={false}
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
    }
  })
)(Downloading)
