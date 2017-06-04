import * as React from 'react'
import {
  ListView,
  ActivityIndicator,
  View,
  ListViewDataSource
} from 'react-native'
import { connect, Dispatch } from 'react-redux'
import * as api from '../../services/api'
import ListItem from '../../components/listitem'
import { ISearchState, ILoadingProps } from '../../interfaces'
import * as actions from '../../actions'
import Router from '../../routers'

interface IProps extends ILoadingProps {
  playlists: api.IPlaylist[]
}

class PlayList extends React.Component<
  IProps,
  { ds: ListViewDataSource }
> {
  constructor (props: IProps) {
    super(props)
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    this.state = {
      ds: ds.cloneWithRows(props.playlists)
    }
  }

  componentWillReceiveProps ({ playlists }: IProps) {
    if (playlists !== this.props.playlists) {
      this.setState({
        ds: this.state.ds.cloneWithRows(playlists)
      })
      return
    }
  }

  renderPlayList = (playlist: api.IPlaylist) => {
    return (
      <ListItem
        title={playlist.name}
        picURI={playlist.coverImgUrl}
        subTitle={playlist.playCount + ' 次播放'}
        key={playlist.id}
        onPress={Router.toPlayList({ route: playlist })}
      />
    )
  }

  renderFooter = () => {
    return this.props.isLoading ?
      <ActivityIndicator animating style={{marginTop: 10}}/> :
      <View />
  }

  onEndReached = () => {
    if (!this.props.isLoading && this.props.playlists.length > 0) {
      this.props.sync()
    }
  }

  render () {
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
  ({
    search: {
      playlist: {
        isLoading, playlists
      }
    }
  }: { search: ISearchState }) => ({
    isLoading, playlists
  }),
  (dispatch: Dispatch<Redux.Action>) => ({
    sync () {
      return dispatch(actions.searchPlaylists())
    }
  })
)(PlayList) as React.ComponentClass<{
  tabLabel: string
}>
