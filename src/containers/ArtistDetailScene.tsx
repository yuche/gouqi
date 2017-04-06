import { connect } from 'react-redux'
import * as React from 'react'
import TabBar from '../components/HomeTabBar'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import { IArtist } from '../services/api'
import {
  View,
  ViewStyle,
  Dimensions,
  Image,
  Animated,
  ScrollView
} from 'react-native'
import ArtistTracks from './ArtistTracksPage'
import ArtistAlbums from './ArtistAlbumsPage'
import ArtistDesciption from './ArtistDescription'
import Navbar from '../components/navbar'
import { get } from 'lodash'
import Parallax from 'react-native-parallax-view'

interface IState {
  tracksY: Animated.Value
}

const { width, height } = Dimensions.get('window')

const HEADER_HEIGHT = 180

interface IProps {
  route: IArtist,
  artist: IArtist
}

interface IState {
  tracksY: Animated.Value,
  albumsY: Animated.Value,
  descriptionY: Animated.Value
}

class Artist extends React.Component<IProps, IState> {
  private tabsIndex = 0


  constructor(props: any) {
    super(props)
    this.state = {
      tracksY: new Animated.Value(0),
      albumsY: new Animated.Value(0),
      descriptionY: new Animated.Value(0)
    }
  }

  componentDidMount() {

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
        {/*{this.renderImage(uri, this.state.scrollY)}
        <ScrollableTabView
          renderTabBar={this.renderTabBar}
        >
          <ArtistTracks
            tabLabel='热门单曲'
            id={artist.id}
          />
          <ArtistAlbums
            tabLabel='专辑'
            id={artist.id}
          />
          <ArtistDesciption
            tabLabel='详情'
            id={artist.id}
            name={artist.name}
          />
        </ScrollableTabView>*/}
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
      <ScrollView
        tabLabel={tabLabel}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}]
        )}
      >
        <Animated.View style={{transform: [{ translateY: playlistY }], paddingBottom: HEADER_HEIGHT}}>
          {children}
        </Animated.View>
      </ScrollView>
    )
  }

  onChangeTab = ({ from, i }) => {
    this.tabsIndex = i
    // this.forceUpdate()
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
              tabLabel='专辑'
              id={artist.id}
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
      <Animated.Image source={{uri}} style={[styles.bg, { transform }]} />
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
    height: 180 + Navbar.HEIGHT,
    resizeMode: 'cover'
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
