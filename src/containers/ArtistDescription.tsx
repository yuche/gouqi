import * as React from 'react'
import { connect } from 'react-redux'
import { syncArtistDescription } from '../actions'
import { Color } from '../styles'
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ScrollView,
  ActivityIndicator
} from 'react-native'

interface IProps {
  id: number,
  name: string,
  tabLabel: string,
  sync: () => Redux.Action,
  isLoading: boolean,
  description: {
    brief: string,
    introduction: IIntroduction[]
  }
}

interface IIntroduction {
  ti: string,
  txt: string
}

class Description extends React.Component<IProps, any> {

  constructor(props) {
    super(props)
  }

  componentDidMount () {
    this.props.sync()
  }

  renderBrief (name: string, brief: string) {
    return (
      <View>
        <View style={styles.header}>
          <Text style={styles.title}>{`${name}简介`}</Text>
        </View>
        <View style={{ marginHorizontal: 10 }}>
          <Text style={{lineHeight: 20}}>{brief}</Text>
        </View>
      </View>
    )
  }

  renderIntroduction (introduction: IIntroduction[]) {
    return introduction.map((i, index) => {
      return (
        <View key={index}>
          {i.ti && <View style={styles.header}>
            <Text style={styles.title}>{i.ti}</Text>
          </View>}
          <View style={{ marginHorizontal: 10 }}>
            <Text style={{lineHeight: 20}}>{i.txt}</Text>
          </View>
        </View>
      )
    })
  }

  render() {
    const {
      isLoading,
      description: {
        brief = '',
        introduction = []
      },
      name
    } = this.props
    return (
      <ScrollView>
        {isLoading && <ActivityIndicator animating style={{marginTop: 10}}/>}
        {!isLoading && this.renderBrief(name, brief)}
        {!isLoading && this.renderIntroduction(introduction)}
      </ScrollView>
    )
  }

}

function mapStateToProps (
  {
    artist: {
      detail,
      isLoadingDescription
    }
  },
  ownProps: IProps
) {
  const artist = detail[ownProps.id] || {}
  const description = artist.description || {
    brief: '',
    introduction: []
  }
  return {
    description,
    isLoading: isLoadingDescription
  }
}

const styles = StyleSheet.create({
  header: {
    marginTop: 10,
    marginBottom: 10,
    flexDirection: 'row',
    borderLeftColor: Color.main,
    borderLeftWidth: 2
  } as ViewStyle,
  title: {
    fontSize: 15,
    marginLeft: 8
  } as TextStyle
})

export default connect(
  mapStateToProps,
  (dispatch, ownProps: IProps) => ({
    sync() {
      return dispatch(syncArtistDescription(ownProps.id))
    }
  })
)(Description) as React.ComponentClass<{tabLabel: string, id: number, name: string}>
