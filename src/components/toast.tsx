import * as React from 'react'
import {
  StyleSheet,
  View,
  ViewStyle,
  Animated,
  Dimensions,
  Text,
  LayoutChangeEvent
} from 'react-native'
import {
  assign
} from '../utils'
// tslint:disable-next-line
const Icon = require('react-native-vector-icons/FontAwesome')

const { height, width } = Dimensions.get('window')

interface IProps {
  entry?: 'top' | 'bottom',
  position?: 'top' | 'center' | 'bottom',
  duration?: number,
  timeout?: number,
}

type styleType = 'success' | 'info' | 'warning' | 'error'

interface IState {
  isShow: boolean,
  text: string,
  slideAnim: Animated.Value,
  kind: styleType,
}


class Toast extends React.Component<IProps, IState> {
  public static defaultProps: IProps = {
    entry: 'top',
    position: 'top',
    duration: 300,
    timeout: 2300
  }
  private timer: NodeJS.Timer
  private height = height
  private width = width

  constructor (props: IProps) {
    super(props)
    this.state = {
      slideAnim: new Animated.Value(-this.height),
      isShow: false,
      text: 'this is a test text',
      kind: 'success'
    }
  }

  componentWillUnmount() {
    this.clearTimer()
  }

  public success (text: string) {
    this.show(text, 'success')
  }

  public error (text: string) {
    this.show(text, 'error')
  }

  public info (text: string) {
    this.show(text, 'info')
  }

  public warning (text: string) {
    this.show(text, 'warning')
  }

  public hide () {
    this.setState(assign(this.state, {
      isShow: false
    }))
    this.state.slideAnim.setValue(-this.height)
  }

  render () {
    const visible = this.state.isShow
    const transform = {transform: [{translateY: this.state.slideAnim}]}

    return visible ?
      <View
        style={styles.container}
      >
        <Animated.View
          onLayout={this.onViewLayout}
          style={[typeStyleFilter(this.state.kind), styles.wrapper, transform]}
        >
          <View style={{position: 'absolute', left: 15}}>
            <Icon size={17} color={'white'} name={this.iconNameFilter()}/>
          </View>
          <Text style={[{ color: 'white' }]}>{this.state.text}</Text>
        </Animated.View>
      </View> :
      <View />
  }

  private iconNameFilter () {
    switch (this.state.kind) {
      case 'success':
        return 'check-circle'
      case 'info':
        return 'info-circle'
      case 'warning':
        return 'exclamation-circle'
      case 'error':
        return 'times-circle'
      default:
        return null
    }
  }

  private show (text: string, kind: styleType) {
    this.clearTimer()

    if (this.state.isShow) {
      this.hide()
    }
    this.setState(assign(this.state, {
      isShow: true,
      text,
      kind
    }))

    const { duration, timeout } = this.props

    this.animation().start()

    this.timer = setTimeout(() => {
      this.animation(-this.height).start(() => {
        this.setState(assign(this.state, {
          isShow: false
        }))
      })
    }, timeout - duration)
  }

  private clearTimer () {
    if (this.timer) {
      clearTimeout(this.timer)
    }
  }

  private animation (toValue = 0) {
    const { duration } = this.props
    return Animated.timing(this.state.slideAnim, {
      duration,
      toValue
    })
  }

  private onViewLayout = ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
    this.height = layout.height
    this.width = layout.width
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    height: 60
  } as ViewStyle,
  wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 60
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
function typeStyleFilter (stype?: styleType) {
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
      return styles.success
  }
}

export default Toast
