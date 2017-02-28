import { Actions, RNRFActions } from 'react-native-router-flux'

interface IRouterPassProps {
  route?: Object | undefined
}

let navigator = Actions

function toHome (passProps?: IRouterPassProps) {
  navigator['home'](passProps)
}

function toLogin (passProps?: IRouterPassProps) {
  return () => navigator['login'](passProps)
}

function toSearch (passProps?: IRouterPassProps) {
  navigator['search'](passProps)
}

function toPlayList (passProps?: IRouterPassProps) {
  return () => navigator['playlist'](passProps)
}

function toComment (passProps?: IRouterPassProps) {
  navigator['comment'](passProps)
}

function pop (passProps?: IRouterPassProps) {
  navigator.pop(passProps)
}

const Router = {
  toHome,
  toLogin,
  toSearch,
  toPlayList,
  toComment,
  pop
}

export default Router
