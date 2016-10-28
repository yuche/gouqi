import * as React from 'react'
import {
  View,
  ViewStyle,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar
} from 'react-native'
import {
  Form
} from '../components/base'
import NavBar from '../components/navbar'
import {
  IRouterProps
} from '../interfaces'


class Search extends React.Component<IRouterProps, any> {
  constructor (props: IRouterProps) {
    super(props)
  }

  render () {
    return <View>
      <View style={styles.container}>
        <View style={styles.formContainer}>
        <Form
          icon='search'
          autoFocus={true}
        />
        </View>
        <View style={styles.cancel}>
          <Text style={{fontSize: 14}} onPress={() => this.props.router.pop()}>取消</Text>
        </View>
      </View>
    </View>

    // return <NavBar
    //   route={this.props.route}
    //   router={this.props.router}
    //   leftButton={Left}
    //   rightButton={Right}
    //   showTitile={false}
    //   hideBorder={true}
    // />
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderWidth: StyleSheet.hairlineWidth,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderColor: '#ccc'
  } as ViewStyle,
  formContainer: {
    flex: 1,
    justifyContent: 'center'
  } as ViewStyle,
  cancel: {
    height: 40,
    alignItems: 'flex-end',
    marginRight: 10,
    justifyContent: 'center'
  } as ViewStyle
})

export default Search
