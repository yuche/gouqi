import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import {
  View,
  ViewStyle,
  Text,
  StyleSheet
} from 'react-native'
import { ISearchQuery, startSearch, ISearchActiveTab, changeSearchActiveTab } from '../actions'
import { Form } from '../components/base'
import { IRouterProps } from '../interfaces'
import * as api from '../services/api'
import TabBar from '../components/homeNavBar'
import PlayList from './search/playlist'
import Song from './search/song'
import Album from './search/album'
import Artist from './search/artist'
import { Actions } from 'react-native-router-flux'

const { SearchType } = api
const ScrollableTabView = require('react-native-scrollable-tab-view') // tslint:disable-line

interface IProps extends IRouterProps {
  startSearch: ISearchQuery,
  changeActiveTabs: ISearchActiveTab
}

interface IState {
  query: string
}

class Search extends React.Component<IProps, IState> {

  constructor (props: IProps) {
    super(props)
    this.state = {
      query: ''
    }
  }

  componentDidMount() {
    api.search('taylor', SearchType.artist).then(res => {
      console.log(res)
    })
  }

  render () {
    return <View style={{flex: 1}}>
      <View style={styles.container}>
        <View style={styles.formContainer}>
        <Form
          icon='search'
          placeholder='搜索歌单，单曲，专辑，艺人'
          autoFocus={true}
          onClear={this.clearQuery}
          onChangeText={this.changeQuery}
          value={this.state.query}
          containerStyle={{paddingBottom: 0, paddingTop: 0}}
          onSubmitEditing={this.startSearching}
        />
        </View>
        <View style={styles.cancel}>
          <Text style={{fontSize: 14}} onPress={this.back}>取消</Text>
        </View>
      </View>
      <ScrollableTabView
        renderTabBar={this.renderTabBar()}
        onChangeTab={this.changeActiveTabs}
      >
        <Song tabLabel='单曲' />
        <PlayList tabLabel='歌单'/>
        <Artist tabLabel='艺人'/>
        <Album tabLabel='专辑' />
      </ScrollableTabView>
    </View>
  }

  private changeActiveTabs = ({ i }: { i: number}) => {
    this.props.changeActiveTabs(i)
  }

  private changeQuery = (query: string) => {
    this.setState({ query })
  }

  private clearQuery = () => {
    this.setState({ query : ''})
  }

  private back = () => {
    Actions.pop()
  }

  private startSearching = () => {
    this.props.startSearch(this.state.query)
  }

  private renderTabBar = () => {
    return () => <TabBar {...this.props} showIcon={false}/>
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    height: 40,
    flexDirection: 'row'
  } as ViewStyle,
  formContainer: {
    flex: 1,
    justifyContent: 'center'
  } as ViewStyle,
  cancel: {
    height: 40,
    alignItems: 'flex-end',
    marginRight: 10,
    justifyContent: 'center'
  } as ViewStyle
})

export default connect(
  () => ({}),
  (dispatch: Dispatch<Redux.Action>) => ({
    startSearch(query: string) {
      return dispatch(startSearch(query))
    },
    changeActiveTabs(index: number) {
      return dispatch(changeSearchActiveTab(index))
    }
  })
)(Search)
