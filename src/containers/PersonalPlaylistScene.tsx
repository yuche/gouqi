import * as React from 'react'
import { IPlaylist } from '../services/api'
import {
  View,
  ListView,
  Text,
  ListViewDataSource
} from 'react-native'
import Router from '../routers'
import Navbar from '../components/navbar'
import ListItem from '../components/listitem'
import { isEmpty } from 'lodash'
import { connect } from 'react-redux'
import { deletePlayliastAction } from '../actions'
import SwipeAction from 'antd-mobile/lib/swipe-action'

interface IProps {
  collect: IPlaylist[]
  created: IPlaylist[],
  delete: (id: number) => Redux.Action
}

class CollectPlaylist extends React.Component<IProps, any> {
  private ds: ListViewDataSource

  constructor(props: IProps) {
    super(props)
    this.ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2
    })
  }

  renderPlayList = (playlist: IPlaylist, sectionId, rowId) => {
    const favoPlaylist = sectionId === 'created' && rowId === '0'
    const rightConfig = favoPlaylist
      ? []
      : [{
        text: '删除',
        onPress: this.delete(playlist.id),
        style: { backgroundColor: 'rgb(244, 51, 60)', color: 'white' }
      }]
    return (
      <SwipeAction
        autoClose
        style={{ backgroundColor: 'white' }}
        right={rightConfig}
      >
        <ListItem
          title={playlist.name}
          picURI={playlist.coverImgUrl}
          subTitle={playlist.trackCount + ' 首'}
          key={playlist.id}
          onPress={Router.toPlayList({ route: playlist })}
        />
      </SwipeAction>
    )
  }

  delete = (id: number) => () => {
    this.props.delete(id)
  }

  renderSectionHeader = (data: any, section: string) => {
    const title = section === 'created' ? '我创建的歌单' : '我收藏的歌单'
    if (isEmpty(data)) {
      return <View />
    }
    return (
      <View style={[{ backgroundColor: '#e2e3e4' }]}>
        <Text style={{ paddingVertical: 5, color: 'gray', fontSize: 13, paddingHorizontal: 10}}>
          {title}
        </Text>
      </View>
    )
  }

  render () {
    const {
      created,
      collect
    } = this.props

    const rightConfig = {
      text: '创建',
      onPress: () => {
        Router.toCreatePlaylist()
      }
    }

    if (created && collect) {
      this.ds = this.ds.cloneWithRowsAndSections({ created, collect })
    }

    return (
      <View style={{flex: 1}}>
        <Navbar
          title='我的歌单'
          textColor='#333'
          rightConfig={rightConfig}
          hideBorder={false}
        />
        <ListView
          enableEmptySections
          removeClippedSubviews={true}
          scrollRenderAheadDistance={90}
          initialListSize={10}
          dataSource={this.ds}
          renderSectionHeader={this.renderSectionHeader}
          renderRow={this.renderPlayList}
          showsVerticalScrollIndicator={true}
        />
      </View>
    )
  }
}

function mapStateToProps (
  {
    personal: {
      playlist: {
        created,
        collect
      }
    }
  }
) {
  return {
    created,
    collect
  }
}

export default connect(
  mapStateToProps,
  (dispatch) => ({
    delete (id: number) {
      return dispatch(deletePlayliastAction(id))
    }
  })
)(CollectPlaylist)
