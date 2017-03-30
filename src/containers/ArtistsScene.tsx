import * as React from 'react'
import { IInfiList } from '../interfaces'
import { IArtist } from '../services/api'
import {
  ListView,
  View,
  ActivityIndicator,
  RefreshControl
} from 'react-native'
import ListItem from '../components/listitem'
import Navbar from '../components/navbar'
import { connect } from 'react-redux'

interface IProps extends IInfiList {
  artists: IArtist[]
}

class Artists extends React.Component<IProps, any> {
  private ds: React.ListViewDataSource

  constructor(props) {
    super(props)
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id})
  }

  renderAlbum = (artist: IArtist) => {
    return (
      <ListItem
        title={artist.name}
        picURI={artist.img1v1Url}
        roundPic
        key={artist.id}
      />
    )
  }

  componentDidMount () {
    if (!this.props.artists.length) {
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
    this.ds = this.ds.cloneWithRows(this.props.artists)
    return (
      <View style={{ flex: 1 }}>
        <Navbar
          title='热门歌手'
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
  artist: {
    artists,
    isLoading,
    isRefreshing
  }
}) {
  return {
    artists,
    isLoading,
    isRefreshing
  }
}

export default connect(
  mapStateToProps,
  (dispatch) => ({
    syncMore() {
      return dispatch({ type: 'artists/sync' })
    },
    refresh() {
      return dispatch( {type: 'artists/refresh' })
    }
  })
)(Artists)
