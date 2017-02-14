import {
  View,
  ViewStyle,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Animated,
  TextStyle
} from 'react-native'
import * as React from 'react'
// tslint:disable-next-line
const NavigationBar = require('react-native-navbar')
// tslint:disable-next-line
const Icon = require('react-native-vector-icons/FontAwesome')
import { Actions } from 'react-native-router-flux'
import Router from '../routers'

type Ianimation = 'fade' | 'slide' | 'none'

interface IProps {
  title: string,
  style?: ViewStyle,
  hideBorder?: boolean,
  titleStyle?: Object
}

/*class NavBar extends React.Component<IProps, any> {

  constructor(props: IProps) {
    super(props)
  }

  render () {
    const buttonWrapper = (children?: JSX.Element, style?: ViewStyle) => {
      return children &&
        <View style={[styles.item, style && style]}>{children}</View>
    }
    const defaultLeftButton = <Icon
      name='chevron-left'
      size={16}
      color='#bbb'
      onPress={this.navBack}
    />
    const {
      statusBar,
      leftButton = defaultLeftButton,
      rightButton,
      title,
      style,
      showTitile = true,
      hideBorder = false,
      transparent = false
    } = this.props
    return <NavigationBar
      statusBar={statusBar}
      leftButton={buttonWrapper(leftButton, { marginLeft: 10 })}
      rightButton={buttonWrapper(rightButton, { marginRight: 10})}
      title={showTitile ? { title, style: {fontSize: 14} } : <View style={{ height : 0}}/>}
      style={[styles.container, style && style ,hideBorder && { borderWidth: 0 }]}
    />
  }

  private navBack = () => {
    Actions.pop()
  }
}*/

class NavBar extends React.Component<IProps, any> {
  static HEIGHT = Platform.OS === 'ios' ? 64 : 32

  constructor(props: any) {
    super(props)
  }

  render () {
    const {
      hideBorder = true,
      style,
      titleStyle,
      title
    } = this.props
    return (
      <View style={[styles.container, style && style, !hideBorder && styles.border]}>
        {this.renderBtn()}
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Animated.Text
            numberOfLines={1}
            style={[styles.title, titleStyle && titleStyle]}
          >
            {title}
          </Animated.Text>
        </View>
        <View style={styles.btn}/>
      </View>
    )
  }

  renderBtn () {
    return (
      <TouchableOpacity onPress={this.back} style={styles.btn}>
        <Icon name='chevron-left' size={16} color='#fff'/>
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
    backgroundColor: 'gray',
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
    fontWeight: 'bold',
    fontSize: 16,
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
