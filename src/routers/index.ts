import * as React from 'react'

import {
  View,
  BackAndroid,
  Platform
} from 'react-native'

import Login from '../containers/login'

class Router {
  private navigator: React.NavigatorStatic

  constructor(navigator: React.NavigatorStatic) {
    this.navigator = navigator
  }

  public toLogin (passProps: {}) {
    this.push({
      passProps,
      component: Login,
      title: '登录'
    })
  }

  public pop () {
    this.navigator.pop()
  }

  private push (route: React.Route) {
    let routesList = this.navigator.getCurrentRoutes()
    let nextIndex = routesList[routesList.length - 1].index + 1
    this.navigator.push(Object.assign({}, route, {
      index: nextIndex,
      id: Date.now().toString()
    }))
  }
}

export default Router
