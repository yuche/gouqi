import * as React from 'react'
import {
  Modal,
  View,
  Text,
  Animated,
  ViewStyle,
  Dimensions,
  ScrollView,
  TouchableWithoutFeedback,
  StyleSheet,
  TextStyle
} from 'react-native'
import { connect } from 'react-redux'
import { ITrack } from '../services/api'
import Navbar from '../components/navbar'
import Checkbox from 'antd-mobile/lib/checkbox'
import Popup from './PopupContainer'
import List from 'antd-mobile/lib/list'
import { Color, centering } from '../styles'
import Icon from 'react-native-vector-icons/FontAwesome'
import { downloadTracksAction, hideBatchOpsModal } from '../actions'
import CollectPopup from '../components/CollectActionSheet'

const CheckboxItem = Checkbox.CheckboxItem

interface IProps {
  visible: boolean,
  tracks: ITrack[],
  kind: string,
  hide: () => Redux.Action,
  collect: (tracks) => Redux.Action,
  download: (tracks) => Redux.Action
}

interface IState {
  selected: number[],
}

const { height } = Dimensions.get('window')

class BatchOps extends React.Component<IProps, IState> {

  private translateY = new Animated.Value(height)

  constructor (props) {
    super(props)
    this.state = {
      selected: []
    }
  }

  componentWillReceiveProps ({ visible }: IProps) {
    if (visible && visible !== this.props.visible) {
      this.setState({
        selected: this.props.tracks.map((t) => t.id)
      })
    }
  }

  renderNavbar (tracksLen: number, selectedLen: number) {
    const title = selectedLen ? `已选定${selectedLen}首` : '批量操作'
    const leftConfig = selectedLen === tracksLen
      ? {
        text: '全不选',
        onPress: () => {
          this.setState({
            selected: []
          } as IState)
        }
      }
      : {
        text: '全选',
        onPress: () => {
          this.setState({
            selected: this.props.tracks.map((t) => t.id)
          })
        }
      }
    const rightConfig = {
      text: '关闭',
      onPress: () => {
        this.hide()
      }
    }

    return (
      <Navbar
        title={title}
        leftConfig={leftConfig}
        rightConfig={rightConfig}
        textColor='#333'
        hideBorder={false}
      />
    )
  }

  hide = () => (this.props.hide())

  checkboxOnChange = (checked: boolean, id: number) => () => {
    const { selected } = this.state
    if (checked) {
      this.setState({
        selected: selected.filter((select) => select !== id)
      })
    } else {
      this.setState({
        selected: [...selected, id]
      })
    }
  }

  renderItem = (track: ITrack) => {
    const { id, name = '' } = track
    const checked = this.state.selected.includes(id)
    const artistName = track
      && track.artists
      && track.artists.reduce((str, acc, i) => str + (i !== 0 ? ' / ' : '') + acc.name, '')
    return (
      <CheckboxItem
        checked={checked}
        key={name}
        onChange={this.checkboxOnChange(checked, id)}
        checkboxStyle={{ tintColor : checked ? Color.main : '#ccc', marginRight: 15}}
      >
        <Text style={{ marginBottom: 5 }} numberOfLines={1}>
          {name}
        </Text>
        <Text style={{ color: '#ccc', fontSize: 13 }} numberOfLines={1}>
          {artistName}
        </Text>
      </CheckboxItem>
    )
  }

  collect = () => (this.props.collect({ id: this.state.selected }))

  download = () => (this.props.download(this.props.tracks.filter((t) => this.state.selected.includes(t.id))))

  render () {
    const {
      tracks,
      visible,
      kind
    } = this.props
    const {
      selected
    } = this.state
    if (!visible) {
      return null
    }
    return (
      <Modal
        visible={visible}
        animationType='slide'
      >
        <CollectPopup />
        <View style={{ flex: 1 }}>
          {this.renderNavbar(tracks.length, selected.length)}
          <ScrollView style={{ flex: 1 }}>
            {tracks.map(this.renderItem)}
          </ScrollView>
        </View>
        <View style={styles.footer}>
          {kind === 'collect' && <TouchableWithoutFeedback onPress={selected.length ? this.collect : undefined}>
            <View style={styles.btn}>
              <Icon name='plus-square-o' size={26} color={selected.length ? 'black' : '#efefef'}  />
              <Text style={[styles.text, selected.length && { color: 'black' }]}>收藏到</Text>
            </View>
          </TouchableWithoutFeedback>}
          {kind === 'download' && <TouchableWithoutFeedback onPress={selected.length ? this.download : undefined}>
            <View style={styles.btn}>
              <Icon name='download' size={26} color={selected.length ? 'black' : '#efefef'}  />
              <Text style={[styles.text, selected.length && { color: 'black' }]}>下载</Text>
            </View>
          </TouchableWithoutFeedback>}
        </View>
      </Modal>
    )
  }
}

const styles = {
  container: {
    flex: 1,
    height
  } as ViewStyle,
  footer: {
    height: 80,
    borderTopColor: '#ccc',
    borderTopWidth: StyleSheet.hairlineWidth,
    ...centering
  } as ViewStyle,
  btn: {
    width: 50,
    ...centering
  } as ViewStyle,
  text: {
    color: '#efefef',
    fontSize: 13
  } as TextStyle
}

function mapStateToProps (
  {
    ui: {
      modal: {
        playlist: {
          visible,
          kind
        }
      }
    },
    player: {
      playlist
    }
  }
) {
  return {
    visible,
    kind,
    tracks: playlist
  }
}

export default connect(
  mapStateToProps,
  (dispatch) => ({
    hide () {
      return dispatch(hideBatchOpsModal())
    },
    collect (tracks) {
      dispatch({ type: 'playlists/track/save', payload: tracks })
      return dispatch({ type: 'ui/popup/collect/show' })
    },
    download (track) {
      dispatch(downloadTracksAction(track))
      return dispatch(hideBatchOpsModal())
    }
  })
)(BatchOps)
