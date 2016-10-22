import Toast from '../components/toast'
import * as React from 'react'
import { connect } from 'react-redux'

import {
  IToastPayload
} from '../interfaces'


class ToastContainer extends React.Component<IToastPayload, any> {
  constructor (props: IToastPayload) {
    super(props)
  }

  componentWillReceiveProps({kind, text}: IToastPayload) {)
    this.toast[kind](text)
  }

  render () {
    return <Toast ref={this.mapToast}/>
  }

  private mapToast = (toast: Toast) => {
    this.toast = toast
  }
}

export default connect(
  ({ ui : { toast: { kind, text, id }} }: { ui: {toast: IToastPayload} }) => ({ kind, text, id })
)(ToastContainer)
