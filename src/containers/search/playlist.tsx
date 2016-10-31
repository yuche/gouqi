import * as React from 'react'
import {
  ListView,
  Text
} from 'react-native'
import { connect, Dispatch } from 'react-redux'
import * as api from '../../services/api'
import ListItem from '../../components/listitem'
import { IPlaylistsProps } from '../../interfaces'

interface IProps extends IPlaylistsProps {
  query: string
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

  componentWillReceiveProps({ playlists }: IProps) {
    if (playlists !== this.props.playlists) {
      this.setState({
        ds: this.state.ds.cloneWithRows(playlists)
      })
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
        renderFooter={this.renderFooter.bind(this)}
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
  })
)(PlayList)
