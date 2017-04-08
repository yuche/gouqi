import * as React from 'react'
import { IInfiList } from '../interfaces'
import { IArtist } from '../services/api'
import {
  ListView,
  View,
  RefreshControl,
  ListViewDataSource
} from 'react-native'
import ListItem from '../components/listitem'
import Navbar from '../components/navbar'
import { connect } from 'react-redux'
import Router from '../routers'

interface IProps extends IInfiList {
  artists: IArtist[]
}

class Artists extends React.Component<IProps, any> {
  private ds: ListViewDataSource

  constructor(props) {
    super(props)
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id})
  }

  renderAlbum = (artist: IArtist) => {
    return (
      <ListItem
        title={artist.name}
        picURI={artist.img1v1Url + '?param=300y300'}
        roundPic
        key={artist.id}
        // tslint:disable-next-line:jsx-no-lambda
        onPress={() => Router.toArtistsDetail({ route: artist })}
      />
    )
  }

  componentDidMount () {
    if (!this.props.artists.length) {
      this.refresh()
    }
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
          title='我喜欢的艺人'
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
          onEndReachedThreshold={30}
          scrollRenderAheadDistance={90}
          renderRow={this.renderAlbum}
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
    favorites,
    isLoadingFavos
  }
}) {
  return {
    artists: favorites,
    isRefreshing: isLoadingFavos
  }
}

export default connect(
  mapStateToProps,
  (dispatch) => ({
    refresh() {
      return dispatch( {type: 'artists/favo' })
    }
  })
)(Artists)
