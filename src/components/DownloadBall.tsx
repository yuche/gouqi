import * as React from 'react'
import { connect } from 'react-redux'
import Interactable from 'react-native-interactable'
import {
  View,
  ViewStyle,
  Animated,
  TouchableWithoutFeedback,
  Dimensions
} from 'react-native'
import Router from '../routers'
import { centering } from '../styles'
import Icon from 'react-native-vector-icons/FontAwesome'
import { isEmpty } from 'lodash'

const { width, height } = Dimensions.get('window')

const WIDTH_FACTOR = width / 375
const HEIGHT_FACTOR = (height - 75) / 667

const snapPoints = [
  {x: -150 * WIDTH_FACTOR, y: 0},
  {x: -150 * WIDTH_FACTOR, y: -150 * HEIGHT_FACTOR},
  {x: -150 * WIDTH_FACTOR, y:  150 * HEIGHT_FACTOR},
  {x: -150 * WIDTH_FACTOR, y: -270 * HEIGHT_FACTOR},
  {x: -150 * WIDTH_FACTOR, y: 270 * HEIGHT_FACTOR},
  {x:  150 * WIDTH_FACTOR, y: 0},
  {x:  150 * WIDTH_FACTOR, y:  150 * HEIGHT_FACTOR},
  {x:  150 * WIDTH_FACTOR, y: -150 * HEIGHT_FACTOR},
  {x:  150 * WIDTH_FACTOR, y: -270 * HEIGHT_FACTOR},
  {x:  150 * WIDTH_FACTOR, y: 270 * HEIGHT_FACTOR}
]

interface IProps {
  visable: boolean
}

class DownloadBall extends React.Component<IProps, any> {
  private animation: Animated.Value

  constructor (props) {
    super(props)
    this.animation = new Animated.Value(0)
  }

  onPress = () => {
    Router.toDownloading()
  }

  componentWillReceiveProps ({ visable }) {
    if (visable !== this.props.visable) {
      this.toggleVisable(visable)
    }
  }

  toggleVisable (visable: boolean) {
    Animated.timing(
      this.animation, {
        toValue: visable ? 1 : 0,
        duration: 300
      }
    ).start()
  }

  render () {
    return (
      <View style={styles.frame} pointerEvents='box-none'>
        <Interactable.View
          snapPoints={snapPoints}
          initialPosition={{ x: -150 * WIDTH_FACTOR, y: -270 * HEIGHT_FACTOR }}
        >
          <TouchableWithoutFeedback onPress={this.onPress}>
            <Animated.View
              style={[styles.ball, {
                transform: [{
                  scale: this.animation.interpolate({
                    inputRange: [0, .2, .4, .6, .8, 1],
                    outputRange: [0, 1.3, .9, 1.03, 0.97, 1]
                  })
                }],
                height: this.animation.interpolate({
                  inputRange: [0, .01, 50],
                  outputRange: [0, 50, 50]
                })
              }]}
            >
              <Icon size={20} name='download' color='white' />
            </Animated.View>
          </TouchableWithoutFeedback>
        </Interactable.View>
      </View>
    )
  }

}

function mapStateToProps ({
  download: {
    downloading
  }
}) {
  return {
    visable: !isEmpty(downloading)
  }
}

export default connect(mapStateToProps)(DownloadBall)

const styles = {
  frame: {
    flex: 1,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 1,
    ...centering
  } as ViewStyle,
  ball: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#12B7F5',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowRadius: 3,
    shadowOpacity: 0.8,
    ...centering
  } as ViewStyle
}
