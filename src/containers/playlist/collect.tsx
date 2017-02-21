import * as React from 'react'
import { IPlaylist, ITrack } from '../../services/api'
import ListItem from '../../components/listitem'
import { connect } from 'react-redux'
import {
  ScrollView,
  Dimensions,
  View,
  ViewStyle,
  Text
} from 'react-native'

const { height } = Dimensions.get('window')

interface IProps {
  track: ITrack,
  created: IPlaylist[],
}

class Collect extends React.Component<IProps, any> {

  constructor(props: IProps) {
    super(props)
  }

  render() {
    const {
      created
    } = this.props
    return (
      <View style={styles.container}>
        <View style={[{ backgroundColor: '#e2e3e4' }]}>
          <Text style={{ paddingVertical: 5, color: 'gray', fontSize: 13, paddingHorizontal: 10}}>
            收藏到歌单
          </Text>
        </View>
        <ScrollView>
          {created.map(this.renderPlaylist)}
        </ScrollView>
      </View>
    )
  }

  renderPlaylist = (playlist: IPlaylist) => {
    return (
      <ListItem
        title={playlist.name}
        picURI={playlist.coverImgUrl + '?param=50y50'}
        subTitle={playlist.trackCount + ' 首'}
        key={playlist.id}
      />
    )
  }
}

const styles = {
  container: {
    maxHeight: height / 2
  } as ViewStyle
}

export default connect(
  (
    {
      personal: {
        playlist: {
          created
        }
      },
      playlists: {
        track
      }
    }: any
  ) => {
    return {
      created,
      track
    }
  }
)(Collect)

