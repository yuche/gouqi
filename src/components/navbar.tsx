import {
  View,
  ViewStyle,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Animated,
  TextStyle,
  Text
} from 'react-native'
import * as React from 'react'
import Icon from 'react-native-vector-icons/FontAwesome'
import { Actions } from 'react-native-router-flux'

interface IProps {
  title: string,
  style?: ViewStyle,
  hideBorder?: boolean,
  titleStyle?: {},
  textColor?: string,
  rightConfig?: IBtnProps,
  leftConfig?: IBtnProps,
  hideLeft?: boolean
}

interface IBtnProps {
  iconName?: string,
  text?: string,
  fontSize?: number,
  onPress?: any
}

class NavBar extends React.Component<IProps, any> {
  static HEIGHT = Platform.OS === 'ios' ? 64 : 32

  constructor (props: any) {
    super(props)
  }

  render () {
    const {
      hideBorder = true,
      hideLeft = false,
      style,
      titleStyle,
      title,
      textColor,
      rightConfig = {},
      leftConfig
    } = this.props
    const colorStyle = textColor && { color: textColor }
    return (
      <View style={[styles.container, style && style, !hideBorder && styles.border]}>
        {!hideLeft && this.renderBtn(leftConfig ? leftConfig : { iconName: 'chevron-left', onPress: this.back })}
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Animated.Text
            numberOfLines={1}
            style={[styles.title, titleStyle && titleStyle, colorStyle]}
          >
            {title}
          </Animated.Text>
        </View>
        {this.renderBtn(rightConfig, 'right')}
      </View>
    )
  }

  renderBtn = (config: IBtnProps, place = 'left') => {
    const { textColor } = this.props
    const color = textColor || 'white'
    const fontSize = config.fontSize || 16
    const margin = place === 'left' ? { marginLeft: 10 } : { marginRight: 10, textAlign: 'right' }
    return (
      <TouchableOpacity onPress={config.onPress} style={styles.btn}>
        {config.iconName && <Icon name={config.iconName} size={fontSize} color={color} style={margin}/>}
        {config.text && <Text style={[{ fontSize, color}, margin]}>{config.text}</Text>}
      </TouchableOpacity>
    )
  }

  back = () => {
    Actions.pop()
  }

}

const styles = StyleSheet.create({
  container: {
    height: NavBar.HEIGHT,
    backgroundColor: '#f8f8f8',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: (Platform.OS === 'ios') ? 20 : 0,
    zIndex: 999
  } as ViewStyle,
  border: {
    borderWidth: StyleSheet.hairlineWidth,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderColor: '#ccc'
  } as ViewStyle,
  title: {
    color: 'white',
    fontSize: 16
  } as TextStyle,
  btn: {
    width: 60,
    height: 40,
    justifyContent: 'center'
    // position: 'absolute'
  } as ViewStyle
})

export default NavBar
