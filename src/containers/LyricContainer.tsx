import * as React from 'react'
import {
  View,
  ViewStyle,
  Animated,
  TouchableWithoutFeedback,
  Dimensions
} from 'react-native'
import Lyric from '../components/Lyric'

interface IProps {
  visable: boolean
}

class Lyrics extends React.Component<IProps, any> {

  constructor (props) {
    super(props)
  }

  render () {
    return (
      <View></View>
    )
  }
}
