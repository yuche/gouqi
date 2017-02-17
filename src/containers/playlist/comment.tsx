import * as React from 'react'
import * as api from '../../services/api'
import Navbar from '../../components/navbar'
import {
  View
} from 'react-native'

interface IProps {
  route: ICommentRoute,
  title: string
}

interface ICommentRoute {
  id: string,
  title: string
}

class Comments extends React.Component<IProps, any> {
  constructor(props: any) {
    super(props)
  }

  componentDidMount () {
    const { route } = this.props
    api.getComments(route.id).then(res => {
      console.log(res)
    })
  }

  render () {
    return (
      <View style={{ flex: 1 }}>
        <Navbar title={this.props.title}/>
      </View>
    )
  }
}

export default Comments
