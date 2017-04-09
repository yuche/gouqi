import * as React from 'react'
import Navbar from '../components/navbar'
import { Form } from '../components/base'
import { connect } from 'react-redux'
import { createPlayliastAction } from '../actions'
import {
  View,
  ScrollView
} from 'react-native'

interface IProps {
  route?: {
    trackId: number
  },
  createPlaylist: (name: string) => Redux.Action
}

class CreatePlaylistScene extends React.Component<IProps, { value: string }> {

  constructor(props: IProps) {
    super(props)
    this.state = {
      value: ''
    }
  }

  handleChange = (value: string) => {
    this.setState({
      value
    })
  }

  onClear = () => {
    this.setState({
      value: ''
    })
  }

  render () {
    const rightConfig = {
      text: '完成',
      onPress: () => {
        this.props.createPlaylist(this.state.value)
      }
    }
    return (
      <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
        <Navbar
          textColor='#333'
          title='创建歌单'
          hideBorder={false}
          rightConfig={rightConfig}
        />
        <ScrollView style={{ marginTop: 10 }} keyboardShouldPersistTaps='always'>
          <Form
            placeholder='歌单名称'
            autoCapitalize='none'
            containerStyle={{padding: 0}}
            wrapperStyle={{ borderColor: 'white' }}
            value={this.state.value}
            editable={true}
            autoFocus={true}
            onClear={this.onClear}
            onChangeText={this.handleChange}
          />
        </ScrollView>
      </View>
    )
  }
}

export default connect(
  () => ({}),
  (dispatch, ownProps: IProps) => ({
    createPlaylist(name: string) {
      const trackId = ownProps && ownProps.route && ownProps.route.trackId
      return dispatch(createPlayliastAction({
        name,
        trackId
      }))
    }
  })
)(CreatePlaylistScene)
