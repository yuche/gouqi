/**
 * TODO:
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
  Animated,
  ScrollView,
  Image
} from 'react-native'
import ArtistTracks from './ArtistTracksPage'
import ArtistAlbums from './ArtistAlbumsPage'
import ArtistDesciption from './ArtistDescription'
import Navbar from '../components/navbar'
import { get } from 'lodash'

interface IState {
  tracksY: Animated.Value
}

const ScrollViewWithLabel: any = ScrollView

const { width, height } = Dimensions.get('window')

const HEADER_HEIGHT = 180

interface IProps {
  route: IArtist,
  artist: IArtist
}

interface IState {
  tracksY: Animated.Value,
  albumsY: Animated.Value,
  descriptionY: Animated.Value,
  blurRadius: number
}

class Artist extends React.Component<IProps, IState> {
  private tabsIndex = 0
  private image: any

  constructor(props: any) {
    super(props)
    this.state = {
      tracksY: new Animated.Value(0),
      albumsY: new Animated.Value(0),
      descriptionY: new Animated.Value(0),
      blurRadius: 0
    }
  }

  componentDidMount() {
    this.state.albumsY.addListener(this.updateBlur)
    this.state.descriptionY.addListener(this.updateBlur)
    this.state.tracksY.addListener(this.updateBlur)
  }

  componentWillUnmount() {
    this.state.albumsY.removeAllListeners()
    this.state.descriptionY.removeAllListeners()
    this.state.tracksY.removeAllListeners()
  }

  getScrollY (index: number) {
    const {
      tracksY,
      albumsY,
      descriptionY
    } = this.state
    if (index === 0) {
      return tracksY
    } else if (index === 1) {
      return albumsY
    }
    return descriptionY
  }

  updateBlur = ({ value }) => {
    let blurRadius = 25 / (HEADER_HEIGHT / value ) || 0
    if (blurRadius > 25) {
      blurRadius = 25
    }
    /**
     * 这里应该使用 
     * setNativeProps({ blurRadius })
     * 来获取更高性能。
     * 但不知为何 blurRadius 不响应。
     * 应该是 react-native 的 bug。
     */
    this.image.setNativeProps({ blurRadius })
  }

  render() {
    const {
      artist
    } = this.props
    const uri = artist.picUrl
    const scrollY = this.getScrollY(this.tabsIndex)
    return (
      <View style={{flex: 1}}>
        <Navbar
          title={artist.name}
          style={styles.navbar}
        />
        {this.renderImage(uri, scrollY)}
        {this.renderScrollTabView(artist, scrollY)}
      </View>
    )
  }

  renderPage = (tabLabel: string, children: JSX.Element, scrollY: Animated.Value) => {
    const playlistY = scrollY.interpolate({
      inputRange: [0, HEADER_HEIGHT, HEADER_HEIGHT],
      outputRange: [0, HEADER_HEIGHT, HEADER_HEIGHT]
    })
    return (
      <ScrollViewWithLabel
        tabLabel={tabLabel}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}]
        )}
      >
        <Animated.View style={{transform: [{ translateY: playlistY }], paddingBottom: HEADER_HEIGHT}}>
          {children}
        </Animated.View>
      </ScrollViewWithLabel>
    )
  }

  onChangeTab = ({ i }) => {
    this.tabsIndex = i
    this.forceUpdate()
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
            {this.renderPage('热门单曲', <ArtistTracks
              id={artist.id}
              showIndex={true}
            />, this.state.tracksY)}
            {this.renderPage('专辑', <ArtistAlbums
              tabLabel='专辑'
              id={artist.id}
            />, this.state.albumsY)}
            {this.renderPage('详情', <ArtistDesciption
              tabLabel='专辑'
              id={artist.id}
              name={artist.name}
            />, this.state.descriptionY)}
          </ScrollableTabView>
        </View>
      </Animated.View>
    )
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
      <Animated.View
        // tslint:disable-next-line:jsx-no-lambda
        style={[styles.bg, { transform }]}
      >
        <Image
          ref={component => this.image = component}
          source={{uri}}
          style={[styles.bg]}
          blurRadius={0}
        />
      </Animated.View>
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
