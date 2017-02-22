import * as React from 'react'
import {
  StyleSheet,
  ViewStyle
} from 'react-native'
import Modal from 'rc-dialog/lib/Modal'

type animationType = 'none' | 'slide-up' | 'slide-down' | 'fade';

interface IPopupProps {
  animationType?: string
  maskClosable?: boolean
  onMaskClose?: () => any
  visible?: boolean
  onAnimationEnd?: (visible: boolean) => void
}

export default class PopupContainer extends React.Component<IPopupProps, any> {
  constructor(props: IPopupProps) {
    super(props)
    this.state = {
      visible: false
    }
  }

  componentWillReceiveProps(nextProps: IPopupProps) {
    if (nextProps.visible !== this.state.visible) {
      this.setState({
        visible: nextProps.visible
      })
    }
  }

  onMaskClose = () => {
    const onMaskClose = this.props.onMaskClose
    if (onMaskClose) {
      onMaskClose()
    }
  }

  render() {
    return (
      <Modal
        animateAppear
        onAnimationEnd={this.props.onAnimationEnd}
        animationType={this.props.animationType as animationType}
        wrapStyle={this.props.animationType === 'slide-up' ? styles.wrap : styles.wrapTop}
        visible={this.state.visible}
        maskClosable={this.props.maskClosable}
        onClose={this.onMaskClose}
      >
        {this.props.children}
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'column',
    justifyContent: 'flex-end'
  } as ViewStyle,
  wrapTop: {
    flexDirection: 'column',
    justifyContent: 'flex-start'
  } as ViewStyle
})
