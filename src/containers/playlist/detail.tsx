import * as React from 'react'
import * as api from '../../services/api'
import {
  View,
  ViewStyle,
  Animated
} from 'react-native'
import Navbar from '../../components/navbar'
import { ILoadingProps } from '../../interfaces'
import { connect, Dispatch } from 'react-redux'
import { syncPlaylistDetail } from '../../actions'

import {
  IinitialState as IDetailState
} from '../../reducers/detail'
// tslint:disable-next-line:no-var-requires

interface IProps extends ILoadingProps {
  route: api.IPlaylist,
  tracks: api.ITrack[]
}

interface IState {
  showTitle: boolean
}

class PlayList extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props)
    this.state = {
      showTitle: false
    }
  }

  componentDidMount () {
    this.props.sync()
  }

  render () {
    const {
      name
    } = this.props.route
    const {
      showTitle
    } = this.state
    return (
      <View style={{flex: 1, backgroundColor: '#f3f3f3'}}>
        {this.renderHeader()}
      </View>
    )
  }

  renderNavbar () {
    return (
      <View></View>
    )
  }

  renderHeader () {
    const {
      name
    } = this.props.route
    const {
      showTitle
    } = this.state
    return (
      <View style={styles.head}>
        <Navbar title={name} showTitile={showTitle} hideBorder transparent/>
      </View>
    )
  }

  renderPlayLists () {
    return (
      <View></View>
    )
  }

}

const styles = {
  head: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0 ,0 , 0, .3)'
  } as ViewStyle
}

function mapStateToProps (
  {
    details: {
      playlist
    }
  }: { details: IDetailState },
  ownProps: IProps
) {
  const { id } = ownProps.route
  return {
    tracks: playlist[id] && playlist[id].tracks || []
  }
}

export default connect(
  mapStateToProps,
  (dispatch: Dispatch<Redux.Action>, ownProps: IProps) => ({
    sync() {
      return dispatch(syncPlaylistDetail(ownProps.route.id))
    }
  })
)(PlayList)
