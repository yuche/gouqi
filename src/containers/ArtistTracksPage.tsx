import TrackList from '../components/TrackList'
import { connect } from 'react-redux'
import * as React from 'react'
import { ITrack } from '../services/api'
import {
  syncArtistTracks
} from '../actions'
import ParallaxScroll from '../components/ParallaxScroll'
import {
  ScrollViewProperties
} from 'react-native'

interface IProps {
  id: number,
  tabLabel: string,
  tracks: ITrack[],
  isLoading: boolean,
  sync: () => Redux.Action,
  showIndex?: boolean
}

class ArtistTracks extends React.Component<IProps, any> {
  private scrollComponent: any

  constructor (props) {
    super(props)
  }

  componentDidMount () {
    this.props.sync()
  }

  renderScrollComponent = (props: ScrollViewProperties) => {
    return (
      <ParallaxScroll
        {...props}
        onScroll={props.onScroll}
        ref={this.mapScrollComponentToRef}
      />
    )
  }

  mapScrollComponentToRef = (component: any) => {
    this.scrollComponent = component
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
        renderScrollComponent={this.renderScrollComponent}
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
    sync () {
      return dispatch(syncArtistTracks(ownProps.id))
    }
  }),
  (s, d, o) => ({...s, ...d, ...o}), // see: https://github.com/reactjs/react-redux/blob/master/docs/api.md#arguments
  { withRef: true }
)(ArtistTracks) as React.ComponentClass<{id: number, showIndex: boolean, tabLabel: string}>
