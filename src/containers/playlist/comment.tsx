import * as React from 'react'
import { IComemnt, IPlaylist, ITrack } from '../../services/api'
import Navbar from '../../components/navbar'
import { ILoadingProps } from '../../interfaces'
import { connect, Dispatch } from 'react-redux'
import { ICommentState } from '../../reducers/comment'
import { getComments, getMoreComments } from '../../actions'
import ListItem from '../../components/listitem'
import { centering } from '../../styles'
import {
  View,
  ListView,
  Text,
  StyleSheet,
  ViewStyle,
  Dimensions,
  ActivityIndicator
} from 'react-native'
import { isEmpty } from 'lodash'
import Router from '../../routers'
// tslint:disable-next-line
const Icon = require('react-native-vector-icons/FontAwesome')
// tslint:disable-next-line:no-var-requires
const timeago = require('timeago.js')
const timeagoInstance = new timeago(new Date(), 'zh_CN')

const { width } = Dimensions.get('window')

interface IProps extends ILoadingProps {
  route: ICommentRoute,
  title: string,
  comments: IComemnt[],
  hotComments: IComemnt[],
  commentCount: number,
  isLoadingMore: boolean,
  more: () => Redux.Action
}

interface ICommentRoute {
  id: number,
  playlist?: IPlaylist,
  track?: ITrack
}

class Comments extends React.Component<IProps, any> {
  private ds: React.ListViewDataSource

  constructor(props: IProps) {
    super(props)
    this.ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2
    })
  }

  componentDidMount () {
    if (isEmpty(this.props.comments)) {
      this.props.sync()
    }
  }

  render () {
    const {
      comments,
      hotComments,
      isLoading,
      commentCount,
      route
    } = this.props

    const title = '评论' + (commentCount ? `(${commentCount})` : '')

    if (comments && hotComments) {
      this.ds = this.ds.cloneWithRowsAndSections({ hotComments, comments })
    }

    return (
      <View style={{ flex: 1 }}>
        <Navbar
          title={title}
          hideBorder={false}
          textColor='#333'
        />
        <ListView
          dataSource={this.ds}
          enableEmptySections
          scrollRenderAheadDistance={90}
          renderRow={this.renderComment}
          initialListSize={20}
          onEndReachedThreshold={15}
          renderFooter={this.renderFooter}
          renderHeader={this.renderHeader(route, isLoading)}
          renderSectionHeader={this.renderSectionHeader}
          onEndReached={this.onEndReached}
        />
      </View>
    )
  }

  renderHeader (route: ICommentRoute, isLoading: boolean) {
    const { playlist, track } = route
    let url = ''
    let title = ''
    let subTitle = ''
    if (playlist) {
      url = playlist.coverImgUrl
      title = playlist.name
      subTitle = playlist.creator.nickname
    }
    if (track) {
      url = track.album.picUrl + '?param=75y75'
      title = track.name
      subTitle = track.artists[0].name
    }
    return () => (
      <View>
        <ListItem
          picURI={url}
          title={title}
          subTitle={subTitle}
          picStyle={{ width: 75, height : 75 }}
          titleStyle={{fontSize: 15}}
          numeberOfLines={0}
          subTitleStyle={{fontSize: 13, color: '#bbb' }}
          mainTitleContainerStyle={{marginTop: 10}}
          subTitleContainerStyle={{marginBottom: 10}}
          noBorder
          // tslint:disable-next-line:jsx-no-multiline-js
          renderRight={
            <View style={[centering, { marginLeft: 10 }]}>
              {playlist && <Icon size={15} color='#ddd' name='chevron-right'/>}
            </View>
          }
          onPress={playlist && Router.toPlayList({ route: playlist })}
        />
        {isLoading && <ActivityIndicator animating style={{paddingVertical: 15}}/>}
      </View>
    )
  }

  renderSectionHeader = (data: any, section: string) => {
    const title = section === 'comments' ? '全部评论' : '精彩评论'
    if (isEmpty(data)) {
      return <View />
    }
    return (
      <View style={[{ backgroundColor: '#e2e3e4' }]}>
        <Text style={{ paddingVertical: 5, color: 'gray', fontSize: 13, paddingHorizontal: 10}}>
          {title}
        </Text>
      </View>
    )
  }

  renderFooter = () => {
    return this.props.isLoadingMore ?
      <ActivityIndicator animating style={{paddingVertical: 15}}/> :
      <View />
  }

  onEndReached = () => {
    if (!this.props.isLoadingMore && !this.props.isLoading && this.props.commentCount) {
      this.props.more()
    }
  }

  renderComment = (comment: IComemnt) => {
    const {
      user,
      time,
      id,
      likedCount,
      beReplied,
      content
    } = comment
    const timeagoStr = timeagoInstance.format(time)
    return (
      <View>
        <ListItem
          title={user.nickname}
          picURI={user.avatarUrl + '?param=50y50'}
          subTitle={timeagoStr}
          picStyle={{ width: 30, height : 30 }}
          roundPic
          titleStyle={{fontSize: 13}}
          noBorder
          // tslint:disable-next-line:jsx-no-multiline-js
          renderRight={
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ color: '#bbb', fontSize: 14, marginRight: 5}}>
                {likedCount}
              </Text>
              <Icon name='thumbs-o-up' size={14} color='#bbb'/>
            </View>
          }
          key={id}
        />
        <View style={{marginLeft: 50, marginRight: 10}}>
          <View style={styles.content}>
            {this.renderContent(beReplied, content)}
          </View>
        </View>
      </View>
    )
  }

  renderContent = (beReplied: IComemnt[], content: string) => {
    const isReplied = !isEmpty(beReplied)
    if (isReplied) {
      const replie = beReplied[0]
      return (
        <View style={styles.contentContainer}>
          <Text>
            {`回复@${replie.user.nickname}：${content}`}
          </Text>
          <View style={styles.border}>
            <View style={{ padding: 10 }}>
              <Text style={{lineHeight: 18}}>
                {`@${replie.user.nickname}：${replie.content}`}
              </Text>
            </View>
          </View>
        </View>
      )
    }

    return (
      <View style={styles.contentContainer}>
        <Text style={{lineHeight: 18}}>
          {content}
        </Text>
      </View>
    )
  }
}

const styles = {
  content: {
    flexDirection: 'row',
    borderColor: '#ccc',
    marginRight: 1,
    width: width - 60,
    borderBottomWidth: StyleSheet.hairlineWidth
  } as ViewStyle,
  border: {
    borderColor: '#bbb',
    borderWidth: StyleSheet.hairlineWidth,
    marginTop: 10,
    marginBottom: 1
  } as ViewStyle,
  contentContainer: {
    width: width - 60,
    paddingBottom: 10
  } as ViewStyle,
  loaderContainer: {
    position: 'absolute',
    top: Navbar.HEIGHT + 110,
    ...centering
  } as ViewStyle
}

function mapStateToProps (
  {
    comment: {
      comments,
      isLoading,
      isLoadingMore
    }
  }: { comment: ICommentState },
  ownProps: IProps
) {
  const { route } = ownProps
  const commentsObj = comments[route.id] || {
    comments: [],
    hotComments: []
  }
  return {
    comments: commentsObj.comments,
    hotComments: commentsObj.hotComments,
    commentCount: commentsObj.total,
    isLoading,
    isLoadingMore
  }
}

export default connect(
  mapStateToProps,
  (dispatch: Dispatch<Redux.Action>, ownProps: IProps) => ({
    sync() {
      return dispatch(getComments(ownProps.route.id))
    },
    more() {
      return dispatch(getMoreComments(ownProps.route.id))
    }
  })
)(Comments)
