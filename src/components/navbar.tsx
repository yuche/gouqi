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

type Ianimation = 'fade' | 'slide' | 'none'

interface IProps {
  title: string,
  style?: ViewStyle,
  hideBorder?: boolean,
  titleStyle?: {},
  textColor?: string,
  rightConfig?: IBtnProps,
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
      rightConfig = {}
    } = this.props
    const colorStyle = textColor && { color: textColor }
    return (
      <View style={[styles.container, style && style, !hideBorder && styles.border]}>
        {!hideLeft && this.renderBtn({ iconName: 'chevron-left', onPress: this.back })}
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Animated.Text
            numberOfLines={1}
            style={[styles.title, titleStyle && titleStyle, colorStyle]}
          >
            {title}
          </Animated.Text>
        </View>
        {this.renderBtn(rightConfig)}
      </View>
    )
  }

  renderBtn = (config: IBtnProps) => {
    const { textColor } = this.props
    const color = textColor || 'white'
    const fontSize = config.fontSize || 16
    return (
      <TouchableOpacity onPress={config.onPress} style={styles.btn}>
        {config.iconName && <Icon name={config.iconName} size={fontSize} color={color}/>}
        {config.text && <Text style={[{ fontSize}, { color }]}>{config.text}</Text>}
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
    // position: 'relative',
    // right: 20
    // marginLeft: -30
  } as TextStyle,
  btn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center'
    // position: 'absolute'
  } as ViewStyle
})

export default NavBar
