import { Actions, RNRFActions } from 'react-native-router-flux'

interface IRouterPassProps {
  props?: Object | undefined
}

let navigator = Actions

function toHome (passProps?: IRouterPassProps) {
  navigator['home'](passProps)
}

function toLogin (passProps?: IRouterPassProps) {
  navigator['login'](passProps)
}

function toSearch (passProps?: IRouterPassProps) {
  navigator['search'](passProps)
}

function pop (passProps?: IRouterPassProps) {
  navigator.pop(passProps)
}

const Router = {
  toHome,
  toLogin,
  toSearch,
  pop
}

export default Router
