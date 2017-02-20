import * as React from 'react'
import {
  View,
  Text,
  ViewStyle,
  TouchableHighlight,
  Dimensions
} from 'react-native'
import { centering } from '../../styles'
import CustomIcon from '../../components/icon'
import Popup from 'antd-mobile/lib/popup'

const { width } = Dimensions.get('window')

interface IProps {
  onClose: () => void
}

class PopupContent extends React.Component<IProps, any> {
  constructor(props: IProps) {
    super(props)
  }

  render () {
    return (
      <View>
        <View style={styles.actionContainer}>
          {this.renderAction('收藏到歌单', <CustomIcon name='collect' size={18}/>)}
          {this.renderAction('评论', <CustomIcon name='comment' size={18}/>)}
          {this.renderAction('下载', <CustomIcon name='download' size={18}/>)}
          {this.renderAction('艺术家', <CustomIcon name='artist' size={18}/>)}
          {this.renderAction('专辑', <CustomIcon name='album' size={18}/>)}
        </View>
        <TouchableHighlight
          style={[centering, styles.footer]}
          underlayColor='#e7e7e7'
          // tslint:disable-next-line:jsx-no-lambda
          onPress={() => Popup.hide()}
        >
          <Text style={{ fontSize: 15}}>
            取消
          </Text>
        </TouchableHighlight>
      </View>
    )
  }

  renderAction (title: string, icon: JSX.Element, onPres?: () => void) {
    return (
      <TouchableHighlight
        style={styles.action}
        onPress={onPres}
        underlayColor='white'
      >
        <View style={centering}>
          {icon}
          <Text style={{ color: '#bbb', paddingTop: 10}}>
            {title}
          </Text>
        </View>
      </TouchableHighlight>
    )
  }
}

const styles = {
  footer: {
    height: 40,
    backgroundColor: '#e7e7e7'
  } as ViewStyle,
  actionContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    flexWrap: 'wrap',
    paddingBottom: 25
  } as ViewStyle,
  action: {
    height: 70,
    paddingTop: 25,
    width: width / 4,
    alignItems: 'center'
  } as ViewStyle,
  btn: {
    height: 30,
    width: 30,
    ...centering
  } as ViewStyle
}

export default PopupContent
