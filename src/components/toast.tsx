import * as React from 'react'
import {
  StyleSheet,
  View,
  ViewStyle,
  Animated,
  Dimensions,
  Text,
  TouchableOpacity,
  LayoutChangeEvent,
  Easing
} from 'react-native'
import {
  assign
} from '../utils'

const Icon = require('react-native-vector-icons/FontAwesome')

const { height, width } = Dimensions.get('window')

interface IProps {
  entry?: 'top' | 'bottom',
  position?: 'top' | 'center' | 'bottom',
  animationDuration?: number,
  timeout?: number
}

type styleType = 'success' | 'info' | 'warning' | 'error'

interface IState {
  position: Animated.Value,
  isShow: boolean,
  isAnimateClose: boolean,
  isAnimateOpen: boolean,
  height: number,
  width: number,
  containerHeight: number,
  containerWidth: number,
  text: string,
  type: styleType,
  slideAnim: Animated.Value
}


class Toast extends React.Component<IProps, IState> {
  public static defaultProps: IProps = {
    entry: 'top',
    position: 'top',
    animationDuration: 400,
    timeout: 2000
  }

  constructor (props: IProps) {
    super(props)
    this.state = {
      position: new Animated.Value(0),
      slideAnim: new Animated.Value(-50),
      isShow: false,
      isAnimateClose: false,
      isAnimateOpen: false,
      height,
      width,
      containerHeight: height,
      containerWidth: width,
      text: 'this is a test text',
      type: 'success'
    }
  }

  componentWillUnmount() {
  }

  renderIcon () {
    switch (this.state.type) {
      case 'success':
        return <Icon size={17} color={'white'} name='check-circle'/>
      case 'info':
        return <Icon name='ios-information-circle-outline'/>
      case 'warning':
        return <Icon name='ios-warning-outline'/>
      case 'error':
        return <Icon name='ios-close-circle-outline'/>
      default:
        return null
    }
  }

  show (text: string) {
    Animated.timing(this.state.slideAnim, { toValue : 0, duration: 200 }).start()
  }

  hide = () => {
    Animated.timing(this.state.slideAnim, { toValue : 80, duration: 200 }).start()
  }

  render () {
    const visible = this.state.isShow
    const size = {
      height: this.state.containerHeight,
      width: this.state.containerWidth
    } as ViewStyle
    const offsetX = (this.state.containerWidth - this.state.width) / 2
    const transform = {transform: [{translateY: this.state.slideAnim}]}
    return visible ?
      <View /> :
      (
      <View
        onLayout={this.onContainerLayout}
        style={styles.container}
      >
        <Animated.View
          onLayout={this.onViewLayout}
          style={[typeStyleFilter(this.state.type), transform, {    justifyContent: 'center', alignItems: 'center',
height: 50 }]}
        >
          <View style={{position: 'absolute', left: 15}}>
                    {this.renderIcon()}
          </View>
          <Text>Bounce me!</Text>
        </Animated.View>
      </View>
    )
  }

  private onContainerLayout = (event: LayoutChangeEvent) => {
    let containerHeight = event.nativeEvent.layout.height
    let containerWidth = event.nativeEvent.layout.width

    if (
      containerHeight === this.state.containerHeight &&
      containerWidth === this.state.containerWidth
    ) {
      return
    }

    
  }

  private onViewLayout = (event: LayoutChangeEvent) => {
    this.setState(assign(this.state, {
      height: event.nativeEvent.layout.height,
      width: event.nativeEvent.layout.width
    }))
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  } as ViewStyle,
  success: {
    backgroundColor: 'rgba(81, 163, 81, 0.9)'
  } as ViewStyle,
  info: {
    backgroundColor: '#2f96b4'
  } as ViewStyle,
  warning : {
    backgroundColor: '#f89406'
  } as ViewStyle,
  error: {
    backgroundColor: '#bd362f'
  } as ViewStyle
})


/** 
 * [TODO]
 * I can't get "styles[this.state.type]" through
 * TypeScript validation
 */
function typeStyleFilter (stype: styleType) {
  switch (stype) {
    case 'success':
      return styles.success
    case 'info':
      return styles.info
    case 'warning':
      return styles.warning
    case 'error':
      return styles.error
    default:
      return {}
  }
}

export default Toast
