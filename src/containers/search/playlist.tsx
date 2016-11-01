import * as React from 'react'
import {
  ListView,
  ActivityIndicator,
  View
} from 'react-native'
import { connect, Dispatch } from 'react-redux'
import * as api from '../../services/api'
import ListItem from '../../components/listitem'
import { IPlaylistsProps } from '../../interfaces'
import * as actions from '../../actions'

interface IProps extends IPlaylistsProps {
  query: string,
  syncPlaylists: () => Redux.Action
}

class PlayList extends React.Component<
  IProps,
  { ds: React.ListViewDataSource }
> {
  constructor (props: IProps) {
    super(props)
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    this.state = {
      ds: ds.cloneWithRows(props.playlists)
    }
  }

  componentWillReceiveProps({ playlists, query }: IProps) {
    if (playlists !== this.props.playlists) {
      this.setState({
        ds: this.state.ds.cloneWithRows(playlists)
      })
    }
    if (query !== this.props.query && query !== '' ) {
      this.props.syncPlaylists()
    }
  }

  renderPlayList = (playlist: api.IPlaylist) => {
    return (
      <ListItem
        title={playlist.name}
        picURI={playlist.coverImgUrl}
        subTitle={playlist.playCount + ' 次播放'}
        key={playlist.id}
      />
    )
  }

  renderFooter = () => {
    return this.props.isLoading ?
      <ActivityIndicator animating style={{marginTop: 10}}/> :
      <View />
  }

  onEndReached = () => {
    if (!this.props.isLoading) {
      this.props.syncPlaylists()
    }
  }

  render() {
    return (
      <ListView
        showsVerticalScrollIndicator
        enableEmptySections
        dataSource={this.state.ds}
        initialListSize={15}
        pagingEnabled={false}
        removeClippedSubviews={true}
        onEndReached={this.onEndReached}
        // onEndReachedThreshold={30}
        scrollRenderAheadDistance={90}
        renderRow={this.renderPlayList}
        renderFooter={this.renderFooter}
      />
    )
  }
}

export default connect(
  ({
    search: {
      playlist: {
        isLoading, playlists, offset, more
      },
      query
    }
  }: { search: { playlist: IPlaylistsProps, query: string } }) => ({
    isLoading, playlists, offset, more,
    query
  }),
  (dispatch: Dispatch<Redux.Action>) => ({
    syncPlaylists() {
      return dispatch(actions.searchPlaylist())
    }
  })
)(PlayList) as React.ComponentClass<{tabLabel: string}>
