import Recommend from './RecommendPage'
import PlayList from './HomePlaylistsPage'
import { connect } from 'react-redux'
import * as React from 'react'
import TabBar from '../components/HomeTabBar'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import UserPage from '../containers/UserPage'
import Toplist from '../containers/ToplistPage'
import Lyrics from '../components/Lyric'
import { View, Text } from 'react-native'

let LYRICS = `[by:工作婊]\n[00:00.00] 作曲 : Justin Hurwitz\n[00:01.00] 作词 : Justin Hurwitz\n[00:09.57]City of stars\n[00:12.49]Are you shining just for me?\n[00:19.30]City of stars\n[00:22.12]There's so much that I can't see\n[00:28.20]Who knows?\n[00:31.45]I felt it from the first embrace I shared with you\n[00:37.90]That now our dreams\n[00:42.10]They've finally come true\n[00:44.47]\n[00:48.26]City of stars\n[00:50.91]Just one thing everybody wants\n[00:57.28]There in the bars\n[00:59.86]And through the smokescreen of the crowded restaurants\n[01:05.77]It's love\n[01:08.91]Yes, all we're looking for is love from someone else\n[01:15.20]A rush\n[01:16.32]A glance\n[01:17.32]A touch\n[01:18.48]A dance\n[01:19.44]\n[01:19.65]To look in somebody's eyes\n[01:22.94]To light up the skies\n[01:25.11]To open the world and send them reeling\n[01:28.36]A voice that says, I'll be here\n[01:31.58]And you'll be alright\n[01:37.12]I don't care if I know\n[01:40.05]Just where I will go\n[01:42.25]'Cause all that I need's this crazy feeling\n[01:45.48]A rat-tat-tat on my heart…\n[01:48.99]\n[01:49.83]Think I want it to stay\n[01:56.14]City of stars\n[01:59.14]Are you shining just for me?\n[02:06.14]City of stars\n[02:10.55]You never shined so brightly\n`

let translation = `[by:咆哮的小清新___]\n[00:09.57]星光之城啊\n[00:12.49]你是否只愿为我闪耀\n[00:19.30]星光之城啊\n[00:22.12]世间有太多不可明了\n[00:28.20]谁又能明了\n[00:31.45]我感觉到自你我初次拥抱时\n[00:37.90]所怀有的那些梦想\n[00:42.10]都已一一实现\n[00:48.26]噢星光之城\n[00:50.91]每个人翘首以盼的\n[00:57.28]就是那热闹的酒吧中\n[00:59.86]以及雾气袅袅的嘈杂餐馆里\n[01:05.77]名叫爱的东西\n[01:08.91]是的 人人都想从某个同样孤单的灵魂里找到爱\n[01:15.20]也许是匆匆擦肩的某一刻\n[01:16.32]或某个抬眼的一瞬间\n[01:17.32]也许是不经意的轻轻触碰\n[01:18.48]激荡起的雀跃欣喜的灵魂\n[01:19.65]从某个人眼中看到的光\n[01:22.94]足以将夜空都点亮\n[01:25.11]足以打开世界的新篇章 不复悲伤过往\n[01:28.36]好像有某个声音总在对我说 我会等你\n[01:31.58]请你放心\n[01:37.12]所以我不会在意自己是否清楚\n[01:40.05]将要到达的目的地\n[01:42.25]我只愿能感受这奋不顾身的疯狂爱意\n[01:45.48]以及我胸腔怦怦跳动的心\n[01:49.83]希望这爱意能永驻我心\n[01:56.14]星光之城啊\n[01:59.14]你是否只愿为我闪耀\n[02:06.14]星光之城啊\n[02:10.55]我感受到了你从未有过的闪耀\n`

class Home extends React.Component<any, any> {
  private tabbar: any

  constructor(props: any) {
    super(props)
    this.state = {
      time: 60
    }
  }

  componentDidMount() {
    // this.props.init()
    setInterval(() => {
      this.setState({
        time: this.state.time + 0.5
      })
    }, 500)
  }

  render() {
    return (
      <ScrollableTabView
        style={{marginTop: 20}}
        renderTabBar={this.renderTabBar}
      >
        <View tabLabel='推荐' style={{flex: 1}}>
          <Text>{this.state.time.toFixed(2)}</Text>
          <Lyrics currentTime={this.state.time} lyrics={LYRICS} />
      </View>
        {/*<Recommend tabLabel='推荐' gotoPlaylist={this.goToPlaylist}/>*/}
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
    return <TabBar ref={component => this.tabbar = component}/>
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
