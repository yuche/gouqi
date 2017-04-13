import * as React from 'react'
import {
  View,
  Dimensions,
  TouchableWithoutFeedback
} from 'react-native'
import ListItem from './listitem'
import { ITrack } from '../services/api'
import * as Progress from 'react-native-progress'
import { Color, centering } from '../styles'
import Icon from 'react-native-vector-icons/FontAwesome'
import CustomIcon from './icon'
const { width } = Dimensions.get('window')

interface IProps {
  track: ITrack,
  progress?: number,
  failed: boolean,
  remove: (id) => any
}

export default class DownloadingItem extends React.Component<IProps, any> {

  constructor(props) {
    super(props)
  }

  renderProgressBar = (progress?: number) => {
    if (!progress) {
      return '待下载'
    }
    return <Progress.Bar
      progress={progress}
      width={width - 100}
      style={{ marginLeft: 10 }}
      color={Color.main}
      borderColor='transparent'
    />
  }

  render() {
    const {
      track,
      progress,
      failed,
      remove
    } = this.props
    return (
      <ListItem
        subTitle={this.renderProgressBar(progress)}
        key={track.id}
        title={track.name}
        renderLeft={
          <View style={[centering, { width: 40 }]}>
            {failed
              ? <Icon size={22} name='times' color={Color.main} />
              : <CustomIcon size={22} name='album' color='#777' />
            }
          </View>
        }
        renderRight={
          !progress ? <TouchableWithoutFeedback
            onPress={remove(track.id)}
          >
            <View style={{ flexDirection: 'row', paddingRight: 10 }}>
              <View style={{ justifyContent: 'center' }}>
                <Icon size={22} name='trash-o' color='#777' />
              </View>
            </View>
          </TouchableWithoutFeedback>
          : undefined
        }
      />
    )
  }
}
