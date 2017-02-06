import { Actions, RNRFActions } from 'react-native-router-flux'

interface IRouterPassProps {
  route?: Object | undefined
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

function toPlayList (passProps?: IRouterPassProps) {
  navigator['playlist'](passProps)
}

function pop (passProps?: IRouterPassProps) {
  navigator.pop(passProps)
}

const Router = {
  toHome,
  toLogin,
  toSearch,
  toPlayList,
  pop
}

export default Router
