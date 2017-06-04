import * as React from 'react'
import {
  ListView,
  ActivityIndicator,
  View,
  ListViewDataSource
} from 'react-native'
import { connect, Dispatch } from 'react-redux'
import { ISearchState, ILoadingProps } from '../../interfaces'
import ListItem from '../../components/listitem'
import * as actions from '../../actions'
import TrackList from '../../components/TrackList'

interface IProps extends ILoadingProps {
  songs: any[],
  query: string
}

interface IState {
  ds: ListViewDataSource
}

class Song extends React.Component<IProps, IState> {
  constructor (props: IProps) {
    super(props)
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    this.state = {
      ds: ds.cloneWithRows(props.songs)
    }
  }

  componentWillReceiveProps ({ songs }: IProps) {
    if (songs !== this.props.songs) {
      this.setState({
        ds: this.state.ds.cloneWithRows(songs)
      })
    }
  }

  renderPlayList = (song: any) => {
    return (
      <ListItem
        title={song.name}
        subTitle={song.artists[0].name}
        key={song.id}
      />
    )
  }

  renderFooter = () => {
    return this.props.isLoading ?
      <ActivityIndicator animating style={{marginTop: 10}}/> :
      <View />
  }

  sync = () => {
    if (!this.props.isLoading && this.props.songs.length > 0) {
      this.props.sync()
    }
  }

  render () {
    const {
      songs,
      isLoading,
      query = 'search'
    } = this.props
    return (
      <TrackList
        tracks={songs}
        isLoading={isLoading}
        pid={query}
        canRefresh={false}
        sync={this.sync}
      />
    )
  }
}

export default connect(
  ({
    search: {
      song: {
        isLoading, songs
      },
      query
    }
  }: { search: ISearchState }) => ({
      isLoading, songs, query
  }),
  (dispatch: Dispatch<Redux.Action>) => ({
    sync () {
      return dispatch(actions.searchSongs())
    }
  })
)(Song) as React.ComponentClass<{
  tabLabel: string
}>
