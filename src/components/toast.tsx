import * as React from 'react'
import {
  StyleSheet,
  View,
  Animated,
  Dimensions,
  Text,
  TouchableWithoutFeedback
} from 'react-native'

const Animatable = require('react-native-animatable')

const Icon = require('react-native-vector-icons/Ionicons')

const defaultTimeout = 2000

interface IProps {
  duration: number,
  type: 'success' | 'fail' | 'info' | 'error',
  opacity: number,
}


class Toast extends React.Component<any, any> {
  private timeout: any
  public refs: any

  constructor (props: any) {
    super(props)
    this.state = {
      show: false,
      text: ''
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeout)
  }

  show (text: string, timeout = defaultTimeout) {
    clearTimeout(this.timeout)
    this.refs.view.slideInDown(500)

    this.setState({
      show: true,
      text
    })

    this.timeout = setTimeout(() => {
      this.setState({
        show: false
      })
    }, 2000)
  }

  hide = () => {
    return this.refs.view.slideOutUp(500)
  }

  render () {
    if (!this.state.show) {return null}
    return (
      <TouchableWithoutFeedback onPress={this.hide} style={{
		position: 'absolute',
    top: 0,
		backgroundColor: 'red',
		borderRadius: 5,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
      }}>
        <Animatable.View ref='view'>
          <Text>Bounce me!</Text>
        </Animatable.View>
      </TouchableWithoutFeedback>
    )
  }
}

export default Toast
