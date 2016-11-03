import * as React from 'react'
import {
  ListView,
  ActivityIndicator,
  View
} from 'react-native'
import { connect, Dispatch } from 'react-redux'
import * as api from '../../services/api'
import { ISearchState } from '../../interfaces'
import ListItem from '../../components/listitem'
import * as actions from '../../actions'

interface IProps {
  query: string,
  syncSongs: () => Redux.Action,
  activeTab: number,
  songs: any[],
  isLoading: boolean,
  tabIndex: number
}

interface IState {
  ds: React.ListViewDataSource
}

class Song extends React.Component<IProps, IState> {
  constructor (props: IProps) {
    super(props)
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    this.state = {
      ds: ds.cloneWithRows(props.songs)
    }
  }

  componentWillReceiveProps({ songs, query, activeTab }: IProps) {
    console.log('reveive song')
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

  onEndReached = () => {
    if (!this.props.isLoading && this.props.songs.length > 0) {
      console.warn('trigger end')
      this.props.syncSongs()
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
        onEndReachedThreshold={35}
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
      song: {
        isLoading, songs
      }
    }
  }: { search: ISearchState }) => ({
    isLoading, songs,
  }),
  (dispatch: Dispatch<Redux.Action>) => ({
    syncSongs() {
      return dispatch(actions.searchSongs())
    }
  })
)(Song) as React.ComponentClass<{
  tabLabel: string,
  tabIndex: number
}>
