import * as React from 'react'
import {
  StyleSheet,
  Text,
  TextStyle,
  View,
  ScrollView,
  ViewStyle,
  RefreshControl,
  TouchableWithoutFeedback
} from 'react-native'
import { IArtist, IAlbum, IPlaylist, ITrack } from '../services/api'
import { connect } from 'react-redux'
import Router from '../routers'
import Icon from 'react-native-vector-icons/FontAwesome'
import Grid from '../components/grid'
import { sampleSize, isEmpty } from 'lodash'
import { playCount } from '../utils'
import { Color } from '../styles'

interface IProps {
  albums: IAlbum[],
  artists: IArtist[],
  playlists: IPlaylist[],
  daily: ITrack[],
  isLoading: boolean,
  sync: () => Redux.Action,
  gotoPlaylist: () => void
}

class RecommendScene extends React.Component<IProps, any> {

  constructor(props: any) {
    super(props)
  }

  renderHeader (title: string, onPress?) {
    const {
      playlists,
      isLoading
    } = this.props
    if (isEmpty(playlists) && isLoading) {
      return null
    }
    return (
      <TouchableWithoutFeedback onPress={onPress}>
        <View style={styles.header}>
          <Text style={{ fontSize: 16, marginLeft: 5 }}>{title}</Text>
          <Icon size={16} color='#ccc' name='chevron-right' style={{ marginLeft: 5 }}/>
        </View>
      </TouchableWithoutFeedback>
    )
  }

  toPlaylistDetail = (playlist: IPlaylist) => {
    Router.toPlayList({ route: playlist })()
  }

  render () {
    const {
      playlists,
      albums,
      artists,
      daily,
      sync,
      isLoading,
      gotoPlaylist
    } = this.props
    return (
      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={sync}/>
        }
      >
        {this.renderHeader('推荐歌单', gotoPlaylist)}
        <Grid data={playlists} onPress={this.toPlaylistDetail}/>
        {this.renderHeader('最新专辑')}
        <Grid data={albums} onPress={() => ({})}/>
        {this.renderHeader('热门歌手')}
        <Grid data={artists} onPress={() => ({})}/>
      </ScrollView>
    )
  }
}

function mapStateToProps ({
  playlist: {
    playlists
  },
  home: {
    albums,
    artists,
    isLoading
  },
  personal: {
    daily
  }
}) {
  return {
    playlists: playlists.slice(0, 6).map(p => ({
      ...p,
      meta: playCount(p.playCount)
    })),
    albums: albums.slice(0, 6).map(a => ({...a, subtitle: a.artist.name})),
    artists: sampleSize(artists, 3),
    isLoading,
    daily: daily.slice(0, 5)
  }
}

export default connect(mapStateToProps,
  (dispatch) => ({
    sync() {
      return dispatch({type: 'home/recommend'})
    }
  })
)(RecommendScene) as React.ComponentClass<{tabLabel: string, gotoPlaylist: any}>

const styles = StyleSheet.create({
  header: {
    marginTop: 10,
    marginBottom: 15,
    flexDirection: 'row',
    borderLeftColor: Color.main,
    borderLeftWidth: 2
  } as ViewStyle,
  instructions: {
    color: '#333333',
    marginBottom: 5,
    textAlign: 'center'
  } as TextStyle,
  welcome: {
    fontSize: 20,
    margin: 10,
    textAlign: 'center'
  } as TextStyle
})
