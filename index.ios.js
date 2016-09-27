require('react-native-browser-builtins')

import * as Api from './lib/services/api'

Api.newAlbums().then(res => {
  console.log(res)
})

import {
  AppRegistry
} from 'react-native'

import gouqi from './lib/routers/'

AppRegistry.registerComponent('gouqi', () => gouqi)
