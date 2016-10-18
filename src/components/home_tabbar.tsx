import * as React from 'react'
import {
  TouchableOpacity,
  View,
  ViewStyle,
  StyleSheet,
  Text,
  Animated
} from 'react-native'
import {
  Actions
} from 'react-native-router-flux'


const Icon = require('react-native-vector-icons/Ionicons')

const activeTextColor = 'navy'
const inactiveTextColor = 'black'

class TabBar extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
  }

  renderTab (
    name: string,
    page: number
  ) {
    const isTabActive = this.props.activeTab === page
    const textColor = isTabActive ? activeTextColor : inactiveTextColor
    const fontWeight = isTabActive ? 'bold' : 'normal'
    return <TouchableOpacity
      key={name}
      onPress={() => this.props.goToPage(page)}
      style={[styles.tab]}
    >
      <View>
        <Text style={[{color: textColor, fontWeight}]}>
          {name}
        </Text>
      </View>
    </TouchableOpacity>
  }

  render () {
    const containerWidth = this.props.containerWidth
    const numberOfTabs = this.props.tabs.length
    const properWidth = (containerWidth - 50) / numberOfTabs
    const tabUnderlineStyle = {
      position: 'absolute',
      width: properWidth,
      height: 2,
      backgroundColor: 'navy',
      bottom: 0
    }
    const left = this.props.scrollValue.interpolate({
      inputRange: [0, 1], outputRange: [0,  properWidth ]
    })

    return (
      <View style={[styles.tabs]}>
        {this.props.tabs.map((name: string, page: number) => this.renderTab(name, page))}
        <Animated.View style={[tabUnderlineStyle, { left }, this.props.underlineStyle]} />

        <TouchableOpacity
          key='icon'
          onPress={Actions.login}
          style={[styles.icon]}
        >
          <View>
            <Icon name='ios-search' size={16}/>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}


const styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 10
  } as ViewStyle,
  tabs: {
    height: 40,
    flexDirection: 'row',
    // justifyContent: 'space-around',
    borderWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderColor: '#ccc'
  } as ViewStyle,
  icon: {
    height: 40,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 10
  }
})

export default TabBar