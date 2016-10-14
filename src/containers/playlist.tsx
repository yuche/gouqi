import * as React from 'react'
import {
  ListView,
} from 'react-native'
import { connect, Dispatch } from 'react-redux'
import * as api from '../services/api'
import ListItem from '../components/listitem'
import List from '../components/list'
import { IPlaylistsProps } from '../interfaces'
import * as Actions from '../actions'


interface IProps extends IPlaylistsProps {
  syncPlaylists: Redux.Action
}

class PlayList extends React.Component<IProps, any> {
  constructor (props: IProps) {
    super(props)
  }

  componentDidMount() {
    console.log(this.props)
    this.props.dispatch(Actions.syncPlaylists())
  }

  renderPlayList = () => {
    const { playlists } = this.props
    return playlists.map((p) => {
      return (
        <ListItem
          title={p.name}
          picURI={p.coverImgUrl}
          subTitle={p.subscribedCount + ' 人收藏'}
          key={p.id}
        />
      )
    })
  }

  render() {
    return (
      <List>
        <ListView
          
        />
      </List>
    )
  }
}

export default connect(
  ({ playlist: {
    isLoading, playlists, offset, more
  } }: { playlist: IPlaylistsProps }) => ({
    isLoading, playlists, offset, more
  })
)(PlayList)

