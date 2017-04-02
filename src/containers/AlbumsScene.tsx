import * as React from 'react'
import { IInfiList } from '../interfaces'
import { IAlbum } from '../services/api'
import {
  ListView,
  View,
  ActivityIndicator,
  RefreshControl
} from 'react-native'
import ListItem from '../components/listitem'
import Navbar from '../components/navbar'
import { connect } from 'react-redux'
import Router from '../routers'

interface IProps extends IInfiList {
  albums: IAlbum[]
}

class Albums extends React.Component<IProps, any> {
  private ds: React.ListViewDataSource

  constructor(props) {
    super(props)
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id})
  }

  renderAlbum = (album: IAlbum) => {
    return (
      <ListItem
        title={album.name}
        picURI={album.picUrl}
        subTitle={album.artist.name}
        key={album.id}
        onPress={this.toAlbumDetail(album)}
      />
    )
  }

  toAlbumDetail = (album: IAlbum) => () => {
    Router.toAlbumDetail({ route: album })
  }

  componentDidMount () {
    if (!this.props.albums.length) {
      this.refresh()
    }
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
    this.ds = this.ds.cloneWithRows(this.props.albums)
    return (
      <View style={{ flex: 1 }}>
        <Navbar
          title='最新专辑'
          textColor='#333'
          hideBorder={false}
        />
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
          renderRow={this.renderAlbum}
          renderFooter={this.renderFooter}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={this.refresh}/>
          }
        />
      </View>
    )
  }
}

function mapStateToProps ({
  album: {
    albums,
    isLoading,
    isRefreshing
  }
}) {
  return {
    albums,
    isLoading,
    isRefreshing
  }
}

export default connect(
  mapStateToProps,
  (dispatch) => ({
    syncMore() {
      return dispatch({ type: 'albums/sync' })
    },
    refresh() {
      return dispatch( {type: 'albums/refresh' })
    }
  })
)(Albums)
