import * as React from 'react'
import {
  View,
  Text,
  ViewStyle,
  TextStyle,
  ScrollView,
  FlatList,
  FlatListStatic,
  TouchableWithoutFeedback
} from 'react-native'
import { isEmpty, findIndex } from 'lodash'
interface ILyric {
  time: number,
  text: string
}

function parseLrc(lyrics: string) {
  return lyrics
    .split('\n')
    .reduce((arr: ILyric[], str: string) => {
      return [...arr, ...parseLrcText(str)]
    }, [] as ILyric[])
    .sort((a, b) => {
      return a.time - b.time
    })
}

function parseLrcText(str: string) {
  const times = str.match(/\[(\d{2}):(\d{2})\.(\d{2,3})]/g)
  const text = str
    .replace(/\[(\d{2}):(\d{2})\.(\d{2,3})]/g, '')
    .replace(/^\s+|\s+$/g, '')
  if (!text) {
    return []
  }
  return times ?
    parseMutipleTime(times).map(time => ({...time, text})) :
    []
}

function parseMutipleTime(times: string[]) {
  return times.reduce((arr, str) => {
    const clock = /\[(\d{2}):(\d{2})\.(\d{2,3})]/.exec(str)
    return clock ?
      [...arr, {
        time: Number(clock[1]) * 60 +
          parseInt(clock[2], 10) +
          parseInt(clock[3], 10) / ((clock[3] + '').length === 2 ? 100 : 1000)
      }] :
      []
  }, [] as {
    time: number
  }[])
}

interface IProps {
  lyrics: string,
  currentTime: number,
  lineHeight?: number
}

interface IState {
  currentIndex: number
}

export default class Lyrics extends React.PureComponent<IProps, IState> {

  private isScrolling: boolean = false

  private timer: number

  private flatlist: any

  private lyricList: ILyric[] = []

  private LINE_HEIGHT: number

  constructor(props: IProps) {
    super(props)
    this.state = {
      currentIndex: 0
    }
    this.lyricList = parseLrc(props.lyrics)
    this.LINE_HEIGHT = props.lineHeight || Number(styles.lrc.height)
  }

  componentWillReceiveProps ({ currentTime, lyrics }: IProps) {
    const {
      currentIndex
    } = this.state
    if (
      currentTime !== this.props.currentTime
      && !isEmpty(this.lyricList)
    ) {
      const index = findIndex(this.lyricList, lrc => lrc.time >= currentTime) - 1
      if (currentIndex !== index && index >= 0  && index <= this.lyricList.length) {
        this.lyricList = this.lyricList.slice()
        this.setState({
          currentIndex: index
        })
        if (!this.isScrolling) {
          // scroll to
          this.flatlist.scrollToIndex({
            animated: true,
            index,
            viewPosition: .5,
            viewOffset: 20
          })
          console.log('is trigger')
        }
      }
    }
  }

  componentWillUnmount() {
    this.clearTimer()
  }

  clearTimer() {
    if (this.timer) {
      clearTimeout(this.timer)
    }
  }

  onTouch = () => {
    this.clearTimer()
    this.isScrolling = true
    this.timer = setTimeout(() => {
      this.isScrolling = false
    }, 3000)
  }

  renderItem = ({item , index}) => {
    return (
      <View style={styles.lrc} key={index}>
        <Text style={[ index === this.state.currentIndex && styles.active ]}>
          {item.text}
        </Text>
      </View>
    )
  }

  getItemLayout = (data, index) => {
    return {
      length: this.LINE_HEIGHT,
      offset: this.LINE_HEIGHT * index,
      index
    }
  }

  keyExtractor = (data, index) => index

  render() {
    return (
      <View style={{ flex: 1 }} onTouchStart={this.onTouch}>
        <FlatList
          // tslint:disable-next-line:jsx-no-lambda
          ref={component => (this.flatlist = component)}
          data={this.lyricList}
          renderItem={this.renderItem}
          getItemLayout={this.getItemLayout}
          keyExtractor={this.keyExtractor}
        />
      </View>
    )
  }
}

const styles = {
  lrc: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center'
  } as ViewStyle,
  active: {
    color: 'red'
  } as TextStyle
}
