import * as React from 'react'
import { TOP_LIST } from '../services/api'
import {
  ScrollView
 } from 'react-native'
import Grid from '../components/grid'
import Router from '../routers'

interface IProps {
  tabLabel: string
}

class Toplist extends React.Component<IProps, any> {

  private toplist: any[]

  constructor (props: IProps) {
    super(props)
    this.toplist = TOP_LIST
    this.toplist = this.toplist.map((list) => {
      return {
        ...list,
        creator: {
          nickname: '网易云音乐',
          avatarUrl: 'http://p1.music.126.net/QWMV-Ru_6149AKe0mCBXKg==/1420569024374784.jpg'
        },
        description: '',
        commentThreadId: `A_PL_0_${list.id}`,
        subscribedCount: 0,
        playCount: 0,
        coverImgUrl: list.imgUrl
      }
    })
  }

  toPlaylist = (item) => {
    Router.toPlayList({route: item})()
  }

  render () {
    return (
      <ScrollView style={{flex: 1}}>
        <Grid data={this.toplist} onPress={this.toPlaylist}/>
      </ScrollView>
    )
  }

}

export default Toplist
