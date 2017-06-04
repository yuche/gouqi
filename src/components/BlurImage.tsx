import * as React from 'react'
import {
  Image,
  Dimensions
} from 'react-native'
import Navbar from '../components/navbar'

const { width } = Dimensions.get('window')

const styles = {
    bg: {
    width,
    height: 180 + Navbar.HEIGHT
  }
}

interface IProps {
  uri: string,
  blurRadius: number
}

export default class BlurImage extends React.Component<IProps, any> {

  constructor (props) {
    super(props)
  }

  shouldComponentUpdate (nextProps: IProps) {
    if (this.props.uri !== nextProps.uri || this.props.blurRadius !== nextProps.blurRadius) {
      return true
    }
    return false
  }

  render () {
    const {
      uri,
      blurRadius
    } = this.props
    return (
      <Image
        source={{uri}}
        style={styles.bg}
        blurRadius={blurRadius}
      />
    )
  }
}
