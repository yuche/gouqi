import * as React from 'react'
import {
  ListView,
  ActivityIndicator,
  View
} from 'react-native'
import { connect, Dispatch } from 'react-redux'
import { ISearchState, ISearchProps } from '../../interfaces'
import ListItem from '../../components/listitem'
import * as actions from '../../actions'

interface IProps extends ISearchProps {
  artists: any[]
}

interface IState {
  ds: React.ListViewDataSource
}

class Artist extends React.Component<IProps, IState> {
  constructor (props: IProps) {
    super(props)
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    this.state = {
      ds: ds.cloneWithRows(props.artists)
    }
  }

  componentWillReceiveProps({ artists }: IProps) {
    if (artists !== this.props.artists) {
      this.setState({
        ds: this.state.ds.cloneWithRows(artists)
      })
    }
  }

  renderPlayList = (artist: any) => {
    return (
      <ListItem
        title={artist.name}
        picURI={artist.img1v1Url}
        key={artist.id}
        roundPic
      />
    )
  }

  renderFooter = () => {
    return this.props.isLoading ?
      <ActivityIndicator animating style={{marginTop: 10}}/> :
      <View />
  }

  onEndReached = () => {
    if (!this.props.isLoading && this.props.artists.length > 0) {
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
      artist: {
        isLoading, artists
      }
    }
  }: { search: ISearchState }) => ({
    isLoading, artists
  }),
  (dispatch: Dispatch<Redux.Action>) => ({
    sync() {
      return dispatch(actions.searchArtists())
    }
  })
)(Artist) as React.ComponentClass<{
  tabLabel: string
}>
