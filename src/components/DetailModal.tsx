import { IPlaylist } from '../services/api'
import * as React from 'react'
import {
  View,
  Dimensions,
  Animated,
  Text,
  Image,
  ViewStyle,
  StyleSheet,
  TouchableWithoutFeedback,
  ScrollView,
  TextStyle
} from 'react-native'
import Navbar from './navbar'
import Router from '../routers'
import { BlurView } from 'react-native-blur'

const { width, height } = Dimensions.get('window')

interface IProps {
  route: IPlaylist
}

export default class DetailModal extends React.Component<IProps, { visible: boolean }> {
  private canRouterPop = true
  constructor(props: IProps) {
    super(props)
    this.state = {
      visible: false
    }
  }

  render() {
    const {
      route
    } = this.props
    return (
      <View>
        <Animated.Image source={{uri: route.coverImgUrl}} style={styles.bg}>
          <BlurView blurType='light' blurAmount={80} style={styles.blur}>
            <View style={{ flex: 1, marginBottom: 60 }}>
              <Navbar
                title=''
                hideLeft
                style={styles.navbar}
                rightConfig={{iconName: 'times', fontSize: 20, onPress: this.hide}}
              />
              <ScrollView style={styles.wraper}>
                <TouchableWithoutFeedback onPress={this.hide}>
                  <View>
                    <View style={styles.head}>
                      <Image source={{uri: route.coverImgUrl}}  style={styles.pic}/>
                      <Text style={styles.headText}>{route.name}</Text>
                    </View>
                    <View style={styles.detail}>
                      <Text style={styles.detailText}>{route.description}</Text>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </ScrollView>
            </View>
          </BlurView>
        </Animated.Image>
      </View>
    )
  }

  hide = () => {
    if (this.canRouterPop) {
      Router.pop()
      this.canRouterPop = false
    }
  }
}

const styles = {
  blur: {
    width,
    height
  },
  bg: {
    width,
    height
  },
  wraper: {
    paddingTop: Navbar.HEIGHT,
    paddingHorizontal: 15
  } as ViewStyle ,
  navbar: {
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    width
  } as ViewStyle,
  head: {
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomColor: '#eee',
    borderBottomWidth: StyleSheet.hairlineWidth
  } as ViewStyle,
  headText: {
    fontSize: 17,
    color: 'white'
  } as TextStyle,
  pic: {
    width: width / 2,
    height: width / 2,
    marginBottom: 15
  } as ViewStyle,
  detail: {
    paddingVertical: 10
  } as ViewStyle,
  detailText: {
    lineHeight: 20,
    color: 'white'
  } as TextStyle
}
