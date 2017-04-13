import * as React from 'react'
import { connect } from 'react-redux'
import { ITrack } from '../services/api'
import {
  ScrollView,
  View
} from 'react-native'
import { removeDownloadingItem } from '../actions'
import Items from '../components/DownloadingItem'
import Navbar from '../components/navbar'

interface IProps {
  tracks: ITrack[],
  failed: ITrack[],
  progress: {
    [props: number]: number
  },
  remove: (id: number) => Redux.Action
}

class Downloading extends React.Component<IProps, any> {

  constructor(props) {
    super(props)
  }

  remove = (id: number) => () => {
    this.props.remove(id)
  }

  render() {
    const {
      tracks,
      progress
    } = this.props
    return (
      <View style={{ flex: 1 }}>
        <Navbar
          title='正在下载'
          textColor='#333'
          hideBorder={false}
        />
        <ScrollView>
          {tracks.map(track => <Items
            track={track}
            progress={progress[track.id]}
            remove={this.remove(track.id)}
            failed={false}
          />)}
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
