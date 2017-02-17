import * as React from 'react'
import { IComemnt } from '../../services/api'
import Navbar from '../../components/navbar'
import { ILoadingProps } from '../../interfaces'
import { connect, Dispatch } from 'react-redux'
import { ICommentState } from '../../reducers/comment'
import { getComments } from '../../actions'
import ListItem from '../../components/listitem'
import {
  View,
  ListView,
  Text,
  ScrollView,
  StyleSheet,
  ViewStyle,
  Dimensions
} from 'react-native'
import { isEmpty } from 'lodash'
// tslint:disable-next-line
const Icon = require('react-native-vector-icons/FontAwesome')

const { width } = Dimensions.get('window')

interface IProps extends ILoadingProps {
  route: ICommentRoute,
  title: string,
  comments: IComemnt[],
  hotComments: IComemnt[],
  commentCount: number
}

interface ICommentRoute {
  id: number,
  title: string
}

class Comments extends React.Component<IProps, any> {
  private hotCommentsDS: React.ListViewDataSource
  private commentsDS: React.ListViewDataSource

  constructor(props: IProps) {
    super(props)
    this.hotCommentsDS = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    this.commentsDS = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
  }

  componentDidMount () {
    this.props.sync()
  }

  render () {
    const {
      commentCount,
      comments,
      hotComments
    } = this.props
    const title = commentCount ? '评论' : `评论（${commentCount}）`

    if (comments) {
      this.commentsDS = this.commentsDS.cloneWithRows(comments)
    }

    if (hotComments) {
      this.hotCommentsDS = this.hotCommentsDS.cloneWithRows(hotComments)
    }

    return (
      <View style={{ flex: 1 }}>
        <Navbar title={title}/>
        <ScrollView>
          <ListView
            dataSource={this.commentsDS}
            enableEmptySections
            showsVerticalScrollIndicator={false}
            renderRow={this.renderComment}
          />
        </ScrollView>
      </View>
    )
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
    return (
      <View>
        <ListItem
          title={user.nickname}
          picURI={user.avatarUrl}
          subTitle={time.toString()}
          picStyle={{ width: 30, height : 30 }}
          roundPic
          titleStyle={{fontSize: 13}}
          noBorder
          // tslint:disable-next-line:jsx-no-multiline-js
          renderRight={
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ color: '#ccc', fontSize: 14, marginRight: 5}}>
                {likedCount}
              </Text>
              <Icon name='thumbs-o-up' size={14} color='#ccc'/>
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
              <Text>
                {`@${replie.user.nickname}：${replie.content}`}
              </Text>
            </View>
          </View>
        </View>
      )
    }

    return (
      <View style={styles.contentContainer}>
        <Text>
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
    borderColor: '#ccc',
    borderWidth: StyleSheet.hairlineWidth,
    marginTop: 10
  } as ViewStyle,
  contentContainer: {
    width: width - 60,
    paddingBottom: 10
  } as ViewStyle
}

function mapStateToProps (
  {
    comment: {
      comments,
      isLoading
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
    commentCount: commentsObj.total || 0,
    isLoading
  }
}



export default connect(
  mapStateToProps,
  (dispatch: Dispatch<Redux.Action>, ownProps: IProps) => ({
    sync({ loading }: { loading: boolean } = { loading: false }) {
      return dispatch(getComments(ownProps.route.id, loading))
    }
  })
)(Comments)
