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
  Animated
} from 'react-native'
import ArtistTracks from './ArtistTracksPage'
import ArtistAlbums from './ArtistAlbumsPage'
import ArtistDesciption from './ArtistDescription'
import Navbar from '../components/navbar'
import { get } from 'lodash'

interface IState {
  scrollY: Animated.Value
}

const { width } = Dimensions.get('window')

interface IProps {
  route: IArtist,
  artist: IArtist
}

class Artist extends React.Component<IProps, any> {

  constructor(props: any) {
    super(props)
    this.state = {
      scrollY: new Animated.Value(0)
    }
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
        />
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
        </ScrollableTabView>
      </View>
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
