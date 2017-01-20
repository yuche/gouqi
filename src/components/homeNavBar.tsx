import * as React from 'react'
import {
  TouchableOpacity,
  View,
  ViewStyle,
  StyleSheet,
  Text,
  Animated,
  NativeComponent
} from 'react-native'
import { Actions } from 'react-native-router-flux'
import {
  Color
} from '../styles'
// tslint:disable-next-line
const Icon = require('react-native-vector-icons/Ionicons')

const inactiveTextColor = 'black'

class IScrollValue extends Animated.Value {
  _value: number // tslint:disable-line
}

interface IProps {
  activeTab: number,
  goToPage: (page: number) => void,
  scrollValue: IScrollValue,
  tabs: string[],
  underlineStyle: ViewStyle,
  containerWidth: number,
  showIcon: boolean
}

type ITabBarProps = IProps & any

interface IState {
  leftUnderlineWidth: Animated.Value,
  undelineWidth: Animated.Value
}

type tabMeasurement = {
  left: number,
  width: number
}

class TabBar extends React.Component<ITabBarProps, IState> {
  refs: {
    [text: string]: any
  }

  private tabMeasurements: tabMeasurement[]

  constructor(props: any) {
    super(props)
    this.tabMeasurements = []
    this.state = {
      leftUnderlineWidth: new Animated.Value(0),
      undelineWidth: new Animated.Value(0)
    }
  }

  componentDidMount() {
   this.props.scrollValue.addListener(this.updateView)
  }

  renderTab = (
    name: string,
    page: number
  ) => {
    const isTabActive = this.props.activeTab === page
    const textColor = isTabActive ? Color.main : inactiveTextColor
    const fontWeight = isTabActive ? 'bold' : 'normal'
    return <TouchableOpacity
      key={name}
      onPress={this.goToPage(page)}
      style={[styles.tab]}
    >
      <View>
        <Text
          ref={`text_${page}`} // tslint:disable-line
          style={[{color: textColor, fontWeight, fontSize: 16}]}
          onLayout={() => this.textOnLayout(page)} // tslint:disable-line
        >
          {name}
        </Text>
      </View>
    </TouchableOpacity>
  }

  render () {
    const { undelineWidth, leftUnderlineWidth } = this.state
    const tabUnderlineStyle = {
      position: 'absolute',
      width: undelineWidth,
      height: 2,
      backgroundColor: Color.main,
      bottom: 0,
      left: leftUnderlineWidth
    }

    return (
      <View style={[styles.tabs]}>
        {this.props.tabs.map((name: string, page: number) => this.renderTab(name, page))}

        <Animated.View style={[tabUnderlineStyle, this.props.underlineStyle]} />

        {this.renderIcon()}
      </View>
    )
  }

  private renderIcon = () => {
    const { showIcon = true } = this.props
    return showIcon ?
      <TouchableOpacity
        key='icon'
        style={[styles.icon]}
        onPress={this.goToSearch}
      >
        <View>
          <Icon name='ios-search' size={18}/>
        </View>
      </TouchableOpacity> :
      null
  }

  private updateView = ({ value }: { value: number }) => {
    const position = Math.floor(value)
    const tabCount = this.props.tabs.length
    const pageOffset = value % 1

    // if (tabCount === 0 || value < 0 || value > tabCount - 1) {
    //   return
    // }
    if (this.isMesuresDone(position) && tabCount && value >= 0 && value <= tabCount - 1) {
      this.updateUnderline(position, pageOffset, tabCount)
    }
  }

  private isMesuresDone (position: number) {
    return this.tabMeasurements[position] && this.tabMeasurements[position + 1]
  }

  private updateUnderline (position: number, pageOffset: number, tabCount: number) {
    const { width, left } = this.tabMeasurements[position]

    if (position < tabCount - 1) {

      let nextTabWidth = this.tabMeasurements[position + 1].width
      let nextTabLeft = this.tabMeasurements[position + 1].left
      nextTabWidth = (pageOffset * nextTabWidth + (1 - pageOffset) * width)
      nextTabLeft = (pageOffset * nextTabLeft + (1 - pageOffset) * left)
      this.state.undelineWidth.setValue(nextTabWidth)
      this.state.leftUnderlineWidth.setValue(nextTabLeft)

    } else {

      this.state.undelineWidth.setValue(width)
      this.state.leftUnderlineWidth.setValue(left)

    }
  }

  private goToPage (page: number)  {
    return () => this.props.goToPage(page)
  }

  private goToSearch = () => {
    Actions.search()
  }

  private textOnLayout = (page: number) => {
    const textComp: NativeComponent = this.refs[`text_${page}`]

    textComp.measure((ox, oy, width, height, pageX) => {
      this.tabMeasurements[page] = { width, left: pageX }
      this.updateView({ value: this.props.scrollValue._value })
    })
  }
}

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  } as ViewStyle,
  tabs: {
    height: 40,
    flexDirection: 'row',
    // justifyContent: 'space-around',
    borderWidth: StyleSheet.hairlineWidth,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderColor: '#ccc'
  } as ViewStyle,
  icon: {
    height: 40,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export default TabBar
