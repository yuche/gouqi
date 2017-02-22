import * as React from 'react'
import {
  View,
  Text,
  ViewStyle,
  TouchableHighlight,
  Dimensions
} from 'react-native'
import { centering } from '../styles'
import CustomIcon from '../components/icon'
import { ITrack } from '../services/api'
import { connect, Dispatch } from 'react-redux'
import { popupCollectActionSheet, hideTrackActionSheet } from '../actions'
import PopuoContainer from './PopupContainer'

const { width } = Dimensions.get('window')

interface IProps {
  track: ITrack,
  visible: boolean,
  popup: () => Redux.Action,
  hide: () => Redux.Action
}

class PopupContent extends React.Component<IProps, any> {
  constructor(props: IProps) {
    super(props)
  }

  render () {
    const {
      hide,
      popup,
      visible
    } = this.props
    return (
      <PopuoContainer
        animationType='slide-up'
        onMaskClose={this.hide}
        visible={visible}
      >
        <View>
          <View style={styles.actionContainer}>
            {this.renderAction('收藏到歌单', <CustomIcon name='collect' size={18}/>, this.popup)}
            {this.renderAction('评论', <CustomIcon name='comment' size={18}/>)}
            {this.renderAction('下载', <CustomIcon name='download' size={18}/>)}
            {this.renderAction('艺术家', <CustomIcon name='artist' size={18}/>)}
            {this.renderAction('专辑', <CustomIcon name='album' size={18}/>)}
          </View>
          <TouchableHighlight
            style={[centering, styles.footer]}
            underlayColor='#e7e7e7'
            onPress={this.hide}
          >
            <Text style={{ fontSize: 15}}>
              取消
            </Text>
          </TouchableHighlight>
        </View>
      </PopuoContainer>
    )
  }

  hide = () => {
    this.props.hide()
  }

  popup = () => {
    this.props.popup()
  }

  renderAction (title: string, icon: JSX.Element, onPress?: any) {
    return (
      <TouchableHighlight
        style={styles.action}
        // tslint:disable-next-line:jsx-no-lambda
        onPress={onPress}
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

export default connect(
  (
    {
      playlist: {
        track
      },
      ui: {
        popup: {
          track: {
            visible
          }
        }
      }
    }: any
  ) => {
    return {
      track,
      visible
    }
  },
  (dispatch: Dispatch<Redux.Action>) => ({
    popup() {
      return dispatch(popupCollectActionSheet())
    },
    hide() {
      return dispatch(hideTrackActionSheet())
    }
  })
)(PopupContent)
