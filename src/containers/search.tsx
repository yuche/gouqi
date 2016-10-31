import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import {
  View,
  ViewStyle,
  Text,
  StyleSheet
} from 'react-native'
import { ISearchQuery, searchQuery } from '../actions'
import {
  Form
} from '../components/base'
import {
  IRouterProps
} from '../interfaces'
import * as api from '../services/api'
const { SearchType } = api

interface IProps extends IRouterProps {
  query: '',
  changeQuery: ISearchQuery
}

class Search extends React.Component<IProps, { query: string }> {
  constructor (props: IProps) {
    super(props)
    this.state = {
      query: ''
    }
  }

  componentDidMount() {
    api.search('华莱士', SearchType.playList).then(res => {
      console.log(res)
    })
  }

  render () {
    return <View>
      <View style={styles.container}>
        <View style={styles.formContainer}>
        <Form
          icon='search'
          placeholder='搜索歌单，单曲，专辑，艺人'
          autoFocus={true}
          onClear={this.clearQuery}
          onChangeText={this.changeQuery}
          value={this.props.query}
          containerStyle={{paddingBottom: 0, paddingTop: 0}}
        />
        </View>
        <View style={styles.cancel}>
          <Text style={{fontSize: 14}} onPress={this.back}>取消</Text>
        </View>
      </View>
    </View>
  }

  private changeQuery = (query: string) => {
    this.props.changeQuery(query)
  }

  private clearQuery = () => {
    this.props.changeQuery('')
  }

  private back = () => {
    this.props.router && this.props.router.pop() // tslint:disable-line
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    height: 40,
    flexDirection: 'row',
    borderWidth: StyleSheet.hairlineWidth,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderColor: '#ccc'
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
  (({ search: { query } }: { search: { query: string } }) => ({ query })),
  (dispatch: Dispatch<Redux.Action>) => ({
    changeQuery(query: string) {
      return dispatch(searchQuery(query))
    }
  })
)(Search)
