import Login from './login'
import RecommendScene from './recommend'
import PlayList from './playlist'
import * as React from 'react'
import {
  View
} from 'react-native'
import TabBar from '../components/home_tabbar'
const ScrollableTabView = require('react-native-scrollable-tab-view') // tslint:disable-line

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
        <RecommendScene tabLabel='一'/>
        <Login tabLabel='一二'/>
        <PlayList tabLabel='一二三'/>
        <View tabLabel='一二三四'/>
      </ScrollableTabView>
    )
  }
}

export default Home
