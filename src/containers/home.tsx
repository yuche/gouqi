import RecommendScene from './recommend'
import PlayList from './HomePlaylistsPage'
import { connect } from 'react-redux'
import * as React from 'react'
import TabBar from '../components/HomeTabBar'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import UserPage from '../containers/UserPage'
import Toplist from '../containers/ToplistPage'

class Home extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
  }

  componentDidMount() {
    this.props.init()
  }

  render() {
    const { renderTabBar } = this
    return (
      <ScrollableTabView
        style={{marginTop: 20}}
        renderTabBar={renderTabBar()}
      >
        <RecommendScene tabLabel='推荐' {...this.props}/>
        <PlayList tabLabel='歌单'/>
        <Toplist tabLabel='排行榜'/>
        <UserPage tabLabel='我的'/>
      </ScrollableTabView>
    )
  }

  private renderTabBar = () => {
    return () => <TabBar {...this.props}/>
  }
}

export default connect(
  () => ({}),
  (dispatch: any) => ({
    init() {
      return dispatch({type: 'app/init'})
    }
  })
)(Home)
