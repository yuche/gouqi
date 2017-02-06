import * as React from 'react'
import * as api from '../../services/api'
import {
  View
} from 'react-native'

class PlayList extends React.Component<any, any> {

  constructor(props: any) {
    super(props)
  }

  componentDidMount () {
    console.log(this.props)
    api.playListDetail(this.props.route.id).then(res => {
      console.log(res)
    })
  }

  componentWillReceiveProps(nextProps: any) {
    console.log(nextProps)
  }

  render () {
    return <View></View>
  }

}

export default PlayList
