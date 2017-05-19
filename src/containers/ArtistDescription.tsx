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
  ActivityIndicator,
  Animated
} from 'react-native'
import { isEmpty } from 'lodash'

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

interface IState {
  scrollY: Animated.Value
}

interface IIntroduction {
  ti: string,
  txt: string
}

const HEADER_HEIGHT = 180

class Description extends React.Component<IProps, any> {

  constructor (props) {
    super(props)
    this.state = {
      scrollY: new Animated.Value(0)
    }
  }

  componentDidMount () {
    this.props.sync()
  }

  renderBrief (name: string, brief = '') {
    if (isEmpty(brief)) {
      return null
    }
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
    if (isEmpty(introduction)) {
      return null
    }
    return introduction.map((i, index) => {
      return (
        <View key={index}>
          {i.ti && <View style={styles.header}>
            <Text style={styles.title}>{i.ti}</Text>
          </View>}
          {i.txt && <View style={{ marginHorizontal: 10 }}>
            <Text style={{ lineHeight: 20 }}>{i.txt}</Text>
          </View>}
        </View>
      )
    })
  }

  render () {
    const {
      isLoading,
      description: {
        brief,
        introduction = []
      },
      name
    } = this.props
    const {
      scrollY
    } = this.state
    const translateY = scrollY.interpolate({
      inputRange: [0, HEADER_HEIGHT, HEADER_HEIGHT],
      outputRange: [0, HEADER_HEIGHT, HEADER_HEIGHT]
    })
    return (
        <ScrollView
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {y: scrollY}}}]
          )}
        >
          <Animated.View style={{transform: [{ translateY }], paddingBottom: HEADER_HEIGHT + 60}}>
            {isLoading && <ActivityIndicator animating={true} style={{marginTop: 10}}/>}
            {!isLoading && this.renderBrief(name, brief)}
            {!isLoading && this.renderIntroduction(introduction)}
          </Animated.View>
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
    sync () {
      return dispatch(syncArtistDescription(ownProps.id))
    }
  }),
  (s, d, o) => ({...s, ...d, ...o}), // see: https://github.com/reactjs/react-redux/blob/master/docs/api.md#arguments
  { withRef: true }
)(Description) as React.ComponentClass<{tabLabel: string, id: number, name: string}>
