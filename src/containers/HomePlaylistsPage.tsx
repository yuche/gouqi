import * as React from 'react'
import {
  ListView,
  View,
  ActivityIndicator,
  RefreshControl,
  ListViewDataSource
} from 'react-native'
import { connect } from 'react-redux'
import * as api from '../services/api'
import ListItem from '../components/listitem'
import { IPlaylistsProps } from '../interfaces'
import * as Actions from '../actions'
import Router from '../routers'
import { playCount } from '../utils'

interface IProps extends IPlaylistsProps {
  syncMore: () => Redux.Action,
  refresh: () => Redux.Action,
  isRefreshing: boolean
}

class PlayList extends React.Component<IProps, {}> {
  private ds: ListViewDataSource

  constructor (props: IProps) {
    super(props)
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id})
  }

  componentDidMount() {
    this.props.refresh()
  }

  renderPlayList = (playlist: api.IPlaylist) => {
    return (
      <ListItem
        title={playlist.name}
        picURI={playlist.coverImgUrl}
        subTitle={playCount(playlist.playCount)}
        key={playlist.id}
        onPress={Router.toPlayList({ route: playlist })}
      />
    )
  }

  onEndReached = () => {
    if (!this.props.isRefreshing) {
      this.props.syncMore()
    }
  }

  renderFooter = () => {
    return this.props.isLoading ?
      <ActivityIndicator animating style={{marginTop: 10}}/> :
      <View />
  }

  refresh = () => {
    this.props.refresh()
  }

  render() {
    const {
      isRefreshing
    } = this.props
    this.ds = this.ds.cloneWithRows(this.props.playlists)
    return (
      <ListView
        showsVerticalScrollIndicator
        enableEmptySections
        dataSource={this.ds}
        initialListSize={15}
        pagingEnabled={false}
        removeClippedSubviews={true}
        onEndReached={this.onEndReached}
        onEndReachedThreshold={30}
        scrollRenderAheadDistance={90}
        renderRow={this.renderPlayList}
        renderFooter={this.renderFooter}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={this.refresh}/>
        }
      />
    )
  }
}

export default connect(
  ({ playlist: {
    isLoading, playlists, isRefreshing
  } }) => ({
    isLoading, playlists, isRefreshing
  }),
  (dispatch) => ({
    syncMore() {
      return dispatch(Actions.syncPlaylists())
    },
    refresh() {
      return dispatch({type: 'playlists/refresh'})
    }
  })
)(PlayList) as React.ComponentClass<{tabLabel: string}>
