import * as React from 'react'
import {
  ListView,
  View,
  ActivityIndicator
} from 'react-native'
import { connect, Dispatch } from 'react-redux'
import * as api from '../services/api'
import ListItem from '../components/listitem'
import { IPlaylistsProps } from '../interfaces'
import * as Actions from '../actions'
import Router from '../routers'

interface IProps extends IPlaylistsProps {
  syncPlaylists: {
    (): Redux.Action
  }
}

function playCount (num: number) {
  const n = num || 0
  if (n < 100000) {
    return n + ' 次播放' // space matters
  } else {
    return Math.round(n / 10000) + ' 万次播放'
  }
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

  componentDidMount() {
    this.props.syncPlaylists()
  }

  componentWillReceiveProps(nextProps: IProps) {
    if (nextProps.playlists !== this.props.playlists) {
      this.setState({
        ds: this.state.ds.cloneWithRows(nextProps.playlists)
      })
    }
  }

  renderPlayList = (playlist: api.IPlaylist) => {
    return (
      <ListItem
        title={playlist.name}
        picURI={playlist.coverImgUrl}
        subTitle={playlist.trackCount.toString()}
        key={playlist.id}
        onPress={Router.toPlayList({ route: playlist })}
      />
    )
  }

  onEndReached = () => {
    if (!this.props.isLoading) {
      this.props.syncPlaylists()
    }
  }

  renderFooter = () => {
    return this.props.isLoading ?
      <ActivityIndicator animating style={{marginTop: 10}}/> :
      <View />
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
        onEndReachedThreshold={30}
        scrollRenderAheadDistance={90}
        renderRow={this.renderPlayList}
        renderFooter={this.renderFooter}
      />
    )
  }
}

export default connect(
  ({ playlist: {
    isLoading, playlists, offset, more
  } }: { playlist: IPlaylistsProps }) => ({
    isLoading, playlists, offset, more
  }),
  (dispatch: Dispatch<Redux.Action>) => ({
    syncPlaylists() {
      return dispatch(Actions.syncPlaylists())
    }
  })
)(PlayList) as React.ComponentClass<{tabLabel: string}>
