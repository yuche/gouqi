import Recommend from './RecommendPage'
import PlayList from './HomePlaylistsPage'
import { connect } from 'react-redux'
import * as React from 'react'
import TabBar from '../components/HomeTabBar'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import UserPage from '../containers/UserPage'
import Toplist from '../containers/ToplistPage'
import { isEmpty } from 'lodash'

class Home extends React.Component<any, any> {
  private tabbar: any

  constructor (props: any) {
    super(props)
  }

  componentDidMount () {
    this.props.init()
  }

  render () {
    return (
      <ScrollableTabView
        style={{marginTop: 20, paddingBottom: this.props.isPlayerVisable ? 60 : 0}}
        renderTabBar={this.renderTabBar}
      >
        <Recommend tabLabel='推荐' gotoPlaylist={this.goToPlaylist}/>
        <PlayList tabLabel='歌单'/>
        <Toplist tabLabel='排行榜'/>
        <UserPage tabLabel='我的'/>
      </ScrollableTabView>
    )
  }

  private goToPlaylist = () => {
    this.tabbar.goToPage(1)()
  }

  private renderTabBar = () => {
    // tslint:disable-next-line:jsx-no-lambda
    return <TabBar ref={(component) => this.tabbar = component}/>
  }
}

export default connect(
  (
    {
      player: {
        playlist
      }
    }
  ) => ({
    isPlayerVisable: !isEmpty(playlist)
  }),
  (dispatch: any) => ({
    init () {
      return dispatch({type: 'app/init'})
    }
  })
)(Home)
