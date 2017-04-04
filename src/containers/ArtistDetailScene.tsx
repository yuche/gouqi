import { connect } from 'react-redux'
import * as React from 'react'
import TabBar from '../components/HomeTabBar'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import ParallaxView from 'react-native-parallax-view'
import { IArtist } from '../services/api'
import {
  View,
  ViewStyle,
  Dimensions,
  Image
} from 'react-native'
import ArtistTracks from './ArtistTracksPage'
import Navbar from '../components/navbar'
import { get } from 'lodash'

const { width } = Dimensions.get('window')

interface IProps {
  route: IArtist,
  artist: IArtist
}

class Artist extends React.Component<IProps, any> {
  private tabbar: any

  constructor(props: any) {
    super(props)
  }

  componentDidMount() {
  }

  render() {
    const {
      artist
    } = this.props
    const uri = artist.picUrl
    return (
      <View style={{flex: 1}}>
        <Navbar
          title={artist.name}
          style={styles.navbar}
        />
        <Image
          source={{uri}}
          style={{width, height: 240}}
          blurRadius={100}
        />
        <ScrollableTabView
          >
          <ArtistTracks
            tabLabel='热门单曲'
            id={artist.id}
          />
          <View tabLabel='测试'></View>
          <View tabLabel='测试2'></View>
        </ScrollableTabView>
      </View>
    )
  }

  private renderTabBar = () => {
    // tslint:disable-next-line:jsx-no-lambda
    return <TabBar ref={component => this.tabbar = component}/>
  }
}

const styles = {
  navbar: {
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    width
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
