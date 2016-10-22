import Login from './login'
import RecommendScene from './recommend'
import PlayList from './playlist'
import * as React from 'react'

import {
  View,
  Text
} from 'react-native'
import TabBar from '../components/home_tabbar'
const ScrollableTabView = require('react-native-scrollable-tab-view')


class Home extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
  }

  render() {
    return (
      <ScrollableTabView
        style={{marginTop: 20}}
        renderTabBar={() => <TabBar />}
      >
        <RecommendScene tabLabel='推荐'/>
        <Login tabLabel='登录'/>
        <PlayList tabLabel='歌单'/>
        <View tabLabel='电台'/>
      </ScrollableTabView>
    )
  }
}

export default Home