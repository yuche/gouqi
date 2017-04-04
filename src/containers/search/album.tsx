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

interface IProps extends ILoadingProps {
  albums: any[]
}

interface IState {
  ds: ListViewDataSource
}

class Album extends React.Component<IProps, IState> {
  constructor (props: IProps) {
    super(props)
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    this.state = {
      ds: ds.cloneWithRows(props.albums)
    }
  }

  componentWillReceiveProps({ albums }: IProps) {
    if (albums !== this.props.albums) {
      this.setState({
        ds: this.state.ds.cloneWithRows(albums)
      })
    }
  }

  renderPlayList = (album: any) => {
    return (
      <ListItem
        title={album.name}
        picURI={album.picUrl}
        subTitle={album.artist.name}
        key={album.id}
      />
    )
  }

  renderFooter = () => {
    return this.props.isLoading ?
      <ActivityIndicator animating style={{marginTop: 10}}/> :
      <View />
  }

  onEndReached = () => {
    if (!this.props.isLoading && this.props.albums.length > 0) {
      this.props.sync()
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
      album: {
        isLoading, albums
      }
    }
  }: { search: ISearchState }) => ({
    isLoading, albums
  }),
  (dispatch: Dispatch<Redux.Action>) => ({
    sync() {
      return dispatch(actions.searchAlbums())
    }
  })
)(Album) as React.ComponentClass<{
  tabLabel: string
}>
