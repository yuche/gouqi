import * as React from 'react'
import { connect } from 'react-redux'
import { IProfile } from '../services/api'
import { PLACEHOLDER_IMAGE } from '../utils'
import { centering } from '../styles'
import {
  View,
  ViewStyle,
  Image,
  Text,
  TextStyle,
  StyleSheet,
  TouchableWithoutFeedback
} from 'react-native'
import ListItem from '../components/listitem'
import Icon from 'react-native-vector-icons/FontAwesome'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Router from '../routers'
import { Color } from '../styles'
import { get } from 'lodash'
import CustomIcon from '../components/icon'

interface IProps {
  profile: IProfile,
  seconds: number,
  isPlayingFM: boolean,
  playFM: () => Redux.Action
}

interface IListProps {
  title: string,
  iconName: string,
  onPress?: any
}

class UserPage extends React.Component<IProps, any> {
  private list: IListProps[]

  constructor (props) {
    super(props)
    this.list = [
      {
        title: '我的歌单',
        iconName: 'list-alt',
        onPress: Router.toPersonalPlaylist()
      },
      {
        title: '我的离线',
        iconName: 'download',
        onPress: Router.toDownloads()
      },
      {
        title: '每日歌曲',
        iconName: 'calendar-check-o',
        onPress: Router.toDailyRecommend()
      },
      {
        title: '播放历史',
        iconName: 'history',
        onPress: Router.toHistoryScene()
      }
    ]
  }

  renderHeader (nickname: string, uri: string, seconds) {
    return (
      <View style={styles.header}>
        <Image source={{uri}} style={styles.headImg}/>
        {nickname && <Text>{nickname}</Text>}
        <Text>{seconds}</Text>
      </View>
    )
  }

  renderListItem = ({ title, iconName, onPress }: IListProps, index: number) => {
    return (
      <ListItem
        key={index}
        title={title}
        titleStyle={styles.title}
        containerStyle={styles.list}
        renderLeft={
          <View style={centering}>
            <Icon name={iconName} size={20} color='#ccc'/>
          </View>}
        renderRight={
          <View style={centering}>
            <Icon name='angle-right' size={20} color='#ccc'/>
          </View>}
        onPress={onPress}
      />
    )
  }

  playFM = () => {
    this.props.playFM()
  }

  render () {
    const {
      profile,
      seconds,
      isPlayingFM
    } = this.props
    const nickname = get(profile, 'nickname', false)
    const uri = get(profile, 'avatarUrl', PLACEHOLDER_IMAGE)
    const fmIcon = isPlayingFM
      ? <Ionicons name='md-volume-up' size={20} color={Color.main}/>
      : <Icon name='angle-right' size={20} color='#ccc'/>
    return (
      <View style={{flex: 1}}>
        <View style={styles.header}>
        <TouchableWithoutFeedback onPress={Router.toLogin()}>
            <Image source={{ uri }} style={styles.headImg} />
        </TouchableWithoutFeedback>
          {nickname && <Text>{nickname}</Text>}
          <Text>{seconds}</Text>
        </View>
        <ListItem
          title='我的私人电台'
          titleStyle={styles.title}
          containerStyle={[styles.list, { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#ccc' }]}
          onPress={isPlayingFM ? undefined : this.playFM}
          renderLeft={
            <View style={centering}>
              <Ionicons name='md-radio' size={20} color='#ccc'/>
            </View>}
          renderRight={
            <View style={centering}>
              {fmIcon}
            </View>}
        />
        {this.list.map(this.renderListItem)}
        <ListItem
          title='我喜欢的艺人'
          titleStyle={styles.title}
          containerStyle={styles.list}
          renderLeft={
            <View style={centering}>
              <CustomIcon name='artist' size={20} color='#ccc'/>
            </View>}
          renderRight={
            <View style={centering}>
              <Icon name='angle-right' size={20} color='#ccc'/>
            </View>}
          // tslint:disable-next-line:jsx-no-lambda
          onPress={() => Router.toFavoriteArtists()}
        />
      </View>
    )
  }

}

const styles = {
  header: {
    ...centering,
    paddingVertical: 20
  } as ViewStyle,
  headImg: {
    width: 60,
    height: 60,
    borderRadius: 30
  } as ViewStyle,
  list: {
    padding: 20,
    borderBottomColor: '#ccc',
    borderBottomWidth: StyleSheet.hairlineWidth
  } as ViewStyle,
  title: {
    fontSize: 16,
    marginLeft: 20
  } as TextStyle
}

function mapStateToProps ({
  personal: {
    profile
  },
  player: {
    seconds,
    playing
  }
}) {
  return {
    profile,
    isPlayingFM: playing.pid === 'fm',
    seconds: Math.round(seconds / 1000)
  }
}

export default connect(
  mapStateToProps,
  (dispatch) => ({
    playFM () {
      return dispatch({type: 'player/fm/play'})
    }
  })
)(UserPage) as React.ComponentClass<{tabLabel: string}>
