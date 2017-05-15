import * as React from 'react'
import {
  View
} from 'react-native'
import TrackPopup from '../components/TrackActionSheet'
import CollectPopup from '../components/CollectActionSheet'
import Toast from '../components/ToastContainer'
import PlaylistPopup from '../components/PlaylistPopup'

const Siblings = () => (
  <View>
    <TrackPopup />
    <PlaylistPopup />
    <CollectPopup />
    <Toast />
  </View>
)

export default Siblings
