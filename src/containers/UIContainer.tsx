import * as React from 'react'
import {
  View
} from 'react-native'
import TrackPopup from '../components/TrackActionSheet'
import CollectPopup from '../components/CollectActionSheet'
import Toast from '../components/ToastContainer'
import Player from './PlayerContainer'

const UI = () => (
  <View>
    <TrackPopup />
    <CollectPopup />
    <Toast />
    <Player />
  </View>
)

export default UI
