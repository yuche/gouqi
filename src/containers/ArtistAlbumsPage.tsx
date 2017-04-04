import * as React from 'react'
import { IAlbum } from '../services/api'
import {
  ListView,
  View,
  ActivityIndicator,
  ListViewDataSource
} from 'react-native'
import ListItem from '../components/listitem'
import { connect } from 'react-redux'
import Router from '../routers'
import { syncArtistAlbums } from '../actions'

interface IProps {
  albums: IAlbum[],
  isLoading: boolean,
  sync: () => Redux.Action,
  id: number,
  tabLabel: string
}

class Albums extends React.Component<IProps, any> {
  private ds: ListViewDataSource

  constructor(props) {
    super(props)
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id})
  }

  renderAlbum = (album: IAlbum) => {
    return (
      <ListItem
        title={album.name}
        picURI={album.picUrl + '?param=300y300'}
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
      this.props.sync()
    }
  }

  renderFooter = () => {
    return this.props.isLoading ?
      <ActivityIndicator animating style={{marginTop: 10}}/> :
      <View />
  }

  render() {
    this.ds = this.ds.cloneWithRows(this.props.albums)
    return (
      <ListView
        showsVerticalScrollIndicator
        enableEmptySections
        dataSource={this.ds}
        initialListSize={15}
        pagingEnabled={false}
        removeClippedSubviews={true}
        onEndReachedThreshold={30}
        scrollRenderAheadDistance={90}
        renderRow={this.renderAlbum}
        renderFooter={this.renderFooter}
      />
    )
  }
}

function mapStateToProps (
  {
    artist: {
      detail,
      isLoadingAlbums
    }
  },
  ownProps: IProps
) {
  const artist = detail[ownProps.id] || {}
  const albums = artist.albums
  return {
    albums: albums || [],
    isLoading: isLoadingAlbums
  }
}

export default connect(
  mapStateToProps,
  (dispatch, ownProps: IProps) => ({
    sync() {
      return dispatch(syncArtistAlbums(ownProps.id))
    }
  })
)(Albums) as React.ComponentClass<{tabLabel: string, id: number}>
