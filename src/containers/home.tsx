import Login from './login'
import RecommendScene from './recommend'
import PlayList from './playlist'
import * as React from 'react'
import {
  View
} from 'react-native'
import TabBar from '../components/homeNavBar'
const ScrollableTabView = require('react-native-scrollable-tab-view') // tslint:disable-line

class Home extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
  }

  render() {
    const { renderTabBar } = this
    return (
      <ScrollableTabView
        style={{marginTop: 20}}
        renderTabBar={renderTabBar()}
      >
        <RecommendScene tabLabel='推荐' {...this.props}/>
        <Login tabLabel='电台'/>
        <PlayList tabLabel='歌单'/>
        <View tabLabel='排行榜'/>
      </ScrollableTabView>
    )
  }

  private renderTabBar = () => {
    return () => <TabBar {...this.props}/>
  }
}

export default Home
