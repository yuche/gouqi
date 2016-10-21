import Toast from '../components/toast'
import * as React from 'react'
import { connect } from 'react-redux'

import {
  IToastPayload
} from '../interfaces'


class ToastContainer extends React.Component<IToastPayload, any> {
  refs: {
    toast: any
  }

  constructor (props: IToastPayload) {
    super(props)
  }

  componentWillReceiveProps({kind, text}: IToastPayload) {
    this.refs.toast[kind](text)
  }

  render () {
    return <Toast ref='toast'/>
  }
}

export default connect(
  ({ ui : { toast: { kind, text }} }: { ui: {toast: IToastPayload} }) => ({ kind, text })
)(ToastContainer)
