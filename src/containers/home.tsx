import RecommendScene from './recommend'
import PlayList from './playlist'
import { connect } from 'react-redux'
import * as React from 'react'
import { createAction } from 'redux-actions'
import {
  View
} from 'react-native'
import TabBar from '../components/homeNavBar'
import ScrollableTabView from 'react-native-scrollable-tab-view'

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
        <View tabLabel='电台'/>
        <PlayList tabLabel='歌单'/>
        <View tabLabel='我的'/>
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
      return dispatch(createAction('app/init')())
    }
  })
)(Home)
