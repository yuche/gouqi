/**
 * TODO:
 * # 1
 * 本页面应该做成 QQ 音乐的艺人详情页那样效果。
 * 但每次切换 tabs 的时候，原来 tabs 的垂直位置也会相应跟着切换。
 * 原因在于的 tabs 的位置取决于两个值：
 * 1. 艺人视差图片的滚动位置；
 * 2. tabs 内部的滚动位置。
 * 当前的 DOM 结构我也想不到什么办法同时 cache 这两个值，
 * 网易云音乐（iOS）的做法是禁止水平滚动切换 tabs，滚动时 tabs 切换条不置顶，
 * 点击 tabs 切换时重置之前的垂直滚动状态强行回到初始状态。
 * 我个人认为这个做法体验非常差。
 * 目前的实现是切换 tabs 时前面两个值也都切换，体验同样突兀，no ideal, but works.
 * 还有一个方法，使用 [react-native-interactable](https://github.com/wix/react-native-interactable)
 * 来实现视差滚动，这样一来 DOM 结构和代码都能得到大幅简化，性能也会有所提升。
 * 可惜目前 react-native-interactable 也不支持滚动元素。see issues: #50, #35
 * 
 * # 2
 * 图片无法根据滚动距离实现毛玻璃效果。
 * react-native-blur 无法更改 blurAmount，所以不能用。
 * react-native 的 Image blurRadius 可以在 iOS 单独使用，
 * 但如果使用 state 来控制 blurRadius 会有严重的性能问题。
 * 而 setNativeProps  方法调用了也无效。
 * 应该是 react-native 的一个 bug。我已经提了 issue:
 * https://github.com/facebook/react-native/issues/13344
 */

import { connect } from 'react-redux'
import * as React from 'react'
import TabBar from '../components/HomeTabBar'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import { IArtist } from '../services/api'
import {
  View,
  ViewStyle,
  Dimensions,
  Animated
} from 'react-native'
import ArtistTracks from './ArtistTracksPage'
import ArtistAlbums from './ArtistAlbumsPage'
import ArtistDesciption from './ArtistDescription'
import Navbar from '../components/navbar'
import { get } from 'lodash'

const { width, height } = Dimensions.get('window')

const HEADER_HEIGHT = 180

interface IProps {
  route: IArtist,
  artist: IArtist
}

interface IState {
  scrollY: Animated.Value,
  blurRadius: number
}

class Artist extends React.Component<IProps, IState> {
  private image: any
  private albumsPage: any
  private tracksPage: any
  private descriptionPage: any
  private events = ['', '', '']

  constructor(props: any) {
    super(props)
    this.state = {
      scrollY: new Animated.Value(0),
      blurRadius: 0
    }
  }

  componentDidMount() {
    this.setState({
      scrollY: this.tracksPage.getWrappedInstance().scrollComponent.state.scrollY
    } as IState, () => {
      this.events[0] = this.state.scrollY.addListener(this.updateBlur)
    })
  }

  componentWillUnmount() {
    this.state.scrollY.removeAllListeners()
  }

  updateBlur = ({ value }) => {
    let blurRadius = 25 / (HEADER_HEIGHT / value ) || 0
    if (blurRadius > 25) {
      blurRadius = 25
    }
    this.image.setNativeProps({ blurRadius })
    console.log(blurRadius)
  }

  render() {
    const {
      artist
    } = this.props
    const {
      scrollY
    } = this.state
    return (
      <View style={{flex: 1}}>
        <Navbar
          title={artist.name}
          style={styles.navbar}
        />
        {this.renderImage(artist.picUrl, scrollY)}
        {this.renderScrollTabView(artist, scrollY)}
      </View>
    )
  }

  onChangeTab = ({ i }) => {
    let scrollY
    if (i === 0) {
      scrollY = this.tracksPage.getWrappedInstance().scrollComponent.state.scrollY
    } else if (i === 1) {
      scrollY = this.albumsPage.getWrappedInstance().scrollComponent.state.scrollY
    } else {
      scrollY = this.descriptionPage.getWrappedInstance().state.scrollY
    }

    this.setState({
      scrollY
    } as IState, () => {
      const id = this.events[i]
      if (id) {
        this.state.scrollY.removeListener(id)
      }
      this.events[i] = this.state.scrollY.addListener(this.updateBlur)
    })
  }

  renderScrollTabView = (artist: IArtist, scrollY: Animated.Value) => {
    const transform = {
      transform: [{ translateY: scrollY.interpolate({
        inputRange: [0 , HEADER_HEIGHT, HEADER_HEIGHT],
        outputRange: [0, -HEADER_HEIGHT, -HEADER_HEIGHT]
      }) }]
    }
    return (
      <Animated.View style={[styles.scroll, transform]}>
        <View style={{ height: height - Navbar.HEIGHT - 40, backgroundColor: 'white'}}>
          <ScrollableTabView
            renderTabBar={this.renderTabBar}
            onChangeTab={this.onChangeTab}
          >
            <ArtistTracks
              ref={this.mapPage('track')}
              id={artist.id}
              showIndex={true}
              tabLabel='热门歌曲'
            />
            <ArtistAlbums
              ref={this.mapPage('album')}
              tabLabel='专辑'
              id={artist.id}
            />
            <ArtistDesciption
              ref={this.mapPage('description')}
              tabLabel='详情'
              id={artist.id}
              name={artist.name}
            />
          </ScrollableTabView>
        </View>
      </Animated.View>
    )
  }

  mapPage = (key: string) => (component) => {
    if (key === 'album') {
      this.albumsPage = component
    }
    if (key === 'track') {
      this.tracksPage = component
    }
    if (key === 'description') {
      this.descriptionPage = component
    }
  }

  renderImage = (uri: string, scrollY: Animated.Value) => {
    const transform = [
      {
        translateY: scrollY.interpolate({
          inputRange: [-HEADER_HEIGHT, 0, HEADER_HEIGHT, HEADER_HEIGHT],
          outputRange: [HEADER_HEIGHT / 2, 0, -HEADER_HEIGHT / 3, -HEADER_HEIGHT / 3]
        })
      },
      {
        scale: scrollY.interpolate({
          inputRange: [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
          outputRange: [2, 1, 1]
        })
      }
    ]
    return (
      <Animated.Image
        // tslint:disable-next-line:jsx-no-lambda
        ref={component => this.image = component}
        source={{uri}}
        style={[styles.bg, { transform }]}
        blurRadius={0}
      />
    )
  }

  private renderTabBar = () => {
    // tslint:disable-next-line:jsx-no-lambda
    return <TabBar showIcon={false}/>
  }
}

const styles = {
  navbar: {
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    width
  } as ViewStyle,
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width,
    height: width
  } as ViewStyle,
  bg: {
    width,
    height: 180 + Navbar.HEIGHT
  },
  scroll: {
    position: 'absolute',
    left: 0,
    top: 180 + Navbar.HEIGHT,
    right: 0,
    bottom: 0
  } as ViewStyle
}

function mapStatetoProps (
  {
    artist: {
      detail
    }
  },
  ownProps: IProps
) {
  const { route } = ownProps
  const artist = get(detail, '[route.id].artist', {})
  return {
    artist: {
      ...route,
      ...artist,
      picUrl: route.picUrl
    }
  }
}

export default connect(mapStatetoProps)(Artist)
