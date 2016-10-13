import * as React from 'react'
import {
  Text,
  View,
  ScrollView
} from 'react-native'
// import ListItem from '../components/listitem'
import * as api from '../services/api'
// import ListItem from '../components/listitem'

const { List, ListItem } = require('react-native-elements')

class PlayList extends React.Component<{
  playlists: any[]
}, any> {
  constructor (props: any) {
    super(props)
    this.state = {
      playlists: []
    }
  }

  componentDidMount () {
    api.topPlayList('20').then(res => {
      console.log(res)
      this.setState({
        playlists: res.playlists
      })
    })
  }

  renderPlayList () {
    return this.state.playlists.map(p => {
      return (
        <ListItem avatar={{uri: p.coverImgUrl}} title={p.name} key={p.id} subtitle={p.subscribedCount + '人收藏'}/>
      )
    })
  }

  render() {
    return (
      <ScrollView>
        <List>
          {this.renderPlayList()}
        </List>
      </ScrollView>
    )
  }
}

export default PlayList
