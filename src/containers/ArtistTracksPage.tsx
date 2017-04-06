import TrackList from '../components/TrackList'
import { connect } from 'react-redux'
import * as React from 'react'
import { ITrack } from '../services/api'
import {
  syncArtistTracks
} from '../actions'

interface IProps {
  id: number,
  tabLabel: string,
  tracks: ITrack[],
  isLoading: boolean,
  sync: () => Redux.Action,
  showIndex?: boolean
}

class ArtistTracks extends React.Component<IProps, any> {

  constructor(props) {
    super(props)
  }

  componentDidMount () {
    this.props.sync()
  }

  render () {
    const {
      id,
      isLoading = false,
      tracks = [],
      showIndex
    } = this.props
    return (
      <TrackList
        showIndex={showIndex}
        isLoading={isLoading}
        pid={id}
        tracks={tracks}
      />
    )
  }
}

function mapStateToProps ({
  artist: {
    detail,
    isLoadingTracks
  }
// tslint:disable-next-line:align
}, ownProps: IProps) {
  const artist = detail[ownProps.id] || {}
  const tracks = artist.tracks || []
  return {
    tracks,
    isLoading: isLoadingTracks
  }
}

export default connect(
  mapStateToProps,
  (dispatch, ownProps: IProps) => ({
    sync() {
      return dispatch(syncArtistTracks(ownProps.id))
    }
  })
)(ArtistTracks) as React.ComponentClass<{id: number, showIndex: boolean}>
