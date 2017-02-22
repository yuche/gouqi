import * as React from 'react'
import {
  View
} from 'react-native'
import TrackPopup from '../components/TrackActionSheet'
import CollectPopup from '../components/CollectActionSheet'

const UI = () => (
  <View>
    <TrackPopup />
    <CollectPopup />
  </View>
)

export default UI
