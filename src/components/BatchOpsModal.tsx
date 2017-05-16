import * as React from 'react'
import {
  Modal,
  View,
  Text
} from 'react-native'
import { connect } from 'react-redux'

class BatchOps extends React.Component<any, any> {

  constructor (props) {
    super(props)
  }

  render () {
    return (
      <Modal visible={this.props.visible}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text>fuck you</Text>
        </View>
      </Modal>
    )
  }
}

function mapStateToProps (
  {
    ui: {
      modal: {
        playlist: {
          visible
        }
      }
    }
  }
) {
  return {
    visible
  }
}

export default connect(mapStateToProps)(BatchOps)
