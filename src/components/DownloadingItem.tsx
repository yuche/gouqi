import * as React from 'react'
import {
  View,
  Dimensions,
  Text,
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
  progress?: IProgress,
  failed: boolean,
  remove: (id) => any,
  stop: () => any
}

interface IProgress {
  total: number,
  receive: number
}

export default class DownloadingItem extends React.Component<IProps, any> {

  constructor (props) {
    super(props)
  }

  renderProgressBar = (progress?: IProgress) => {
    if (!progress) {
      return '待下载'
    }
    const { total, receive } = progress
    return <View style={{ flexDirection: 'row'}}>
      <View style={{ marginLeft: 10, marginRight: 5, marginTop: 5 }}>
        <Progress.Bar
          borderRadius={2}
          height={4}
          progress={receive / total}
          width={width - 200}
          color={Color.main}
        />
      </View>
      <Text style={{ fontSize: 12, color: '#bbb' }}>{`${receive}M / ${total}M`}</Text>
    </View>
  }

  render () {
    const {
      track,
      progress,
      failed,
      remove,
      stop
    } = this.props
    return (
      <ListItem
        subTitle={this.renderProgressBar(progress)}
        title={track.name}
        renderLeft={
          <View style={[centering, { width: 40, height: 40 }]}>
            {failed
              ? <Icon size={22} name='times' color={Color.main} />
              : <CustomIcon size={22} name='album' color='#777' />
            }
          </View>}
        renderRight={
          <TouchableWithoutFeedback
            // tslint:disable-next-line:jsx-no-lambda
            onPress={() => !progress ? remove(track.id) : stop()}
          >
            <View style={{ flexDirection: 'row', paddingRight: 10 }}>
              <View style={{ justifyContent: 'center' }}>
                <Icon size={22} name='trash-o' color='#777' />
              </View>
            </View>
          </TouchableWithoutFeedback>
        }
      />
    )
  }
}
