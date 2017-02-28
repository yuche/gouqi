import Toast from './toast'
import * as React from 'react'
import { connect } from 'react-redux'
import { View } from 'react-native'

// tslint:disable-next-line:no-var-requires
const RootSiblings = require('react-native-root-siblings').default

import {
  IToastPayload
} from '../interfaces'

class ToastContainer extends React.Component<IToastPayload, any> {
  private toast: any

  constructor (props: IToastPayload) {
    super(props)
  }

  componentWillReceiveProps({ kind, text }: IToastPayload) {
    this.toast.update(
      <Toast kind={kind} text={text} visible={true}/>
    )
  }

  componentWillMount() {
    this.toast = new RootSiblings(<Toast visible={false}/>)
  }

  componentWillUnmount() {
    this.toast.destroy()
  }

  render () {
    return null
  }

}

export default connect(
  ({ ui : { toast: { kind, text, id  }} }: { ui: {toast: IToastPayload} }) => ({ kind, text, id })
)(ToastContainer)
