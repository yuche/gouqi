import * as React from 'react'
import {
  View,
  Text,
  ViewStyle,
  TextStyle,
  FlatList,
  ActivityIndicator
} from 'react-native'
import { isEmpty, findIndex } from 'lodash'
interface ILyric {
  time: number,
  text: string,
  translation?: string
}

function parseLyrics(lyrics: string) {
  return lyrics
    .split('\n')
    .reduce((arr: ILyric[], str: string) => {
      return [...arr, ...parseLrcText(str)]
    }, [] as ILyric[])
    .sort((a, b) => {
      return a.time - b.time
    })
}

function parselrcWithTranslation(s1: string, s2: string) {
  const original = parseLyrics(s1)
  const translations = parseLyrics(s2)
  return original.map(({ time, text }) => {
    const lrc = translations.find(t => t.time === time)
    const translation = lrc ? lrc.text : ''
    return {
      time,
      text,
      translation
    }
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
  lyrics: {
    original: string,
    translations?: string
  },
  currentTime: number,
  refreshing: boolean,
  lineHeight?: number,
}

interface IState {
  currentIndex: number
}

export default class Lyrics extends React.PureComponent<IProps, IState> {
  public static defaultProps: Partial<IProps> = {
    lineHeight: 40,
    refreshing: true
  }

  private isScrolling: boolean = false

  private timer: number

  private Flatlist: any

  private lyricList: ILyric[] = []

  constructor(props: IProps) {
    super(props)
    this.state = {
      currentIndex: 0
    }
    const { lyrics: {
      translations,
      original
    } } = props
    this.lyricList = translations ?
      parselrcWithTranslation(original, translations) :
      parseLyrics(original)
  }

  componentWillReceiveProps ({ currentTime, lyrics, lineHeight, refreshing }: IProps) {
    const {
      currentIndex
    } = this.state
    if (
      currentTime !== this.props.currentTime
      && !isEmpty(this.lyricList)
      && !refreshing
    ) {
      const index = findIndex(this.lyricList, (lrc, index) => {
        const next = this.lyricList[index + 1]
        return lrc.time >= currentTime &&
          (!next || currentTime < next.time)
      }) - 1
      if ( currentIndex !== index) {
        const isIndexValid = index >= 0
        // this.lyricList = this.lyricList.slice()
        this.setState({
          currentIndex: isIndexValid ? index : this.lyricList.length - 1
        })
        if (!this.isScrolling && isIndexValid && this.Flatlist) {
          // scroll to
          this.Flatlist.scrollToIndex({
            animated: true,
            index: index + 1,
            viewPosition: .5,
            ViewOffset: Number(lineHeight) / 2
          })
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
    const isActive = index === this.state.currentIndex
    return (
      <View style={[styles.lrc, this.props.lineHeight && { height: this.props.lineHeight }]} key={index}>
        {this.renderText(item.text, isActive)}
        {this.renderText(item.translation, isActive)}
      </View>
    )
  }

  renderText = (text: string, isActive: boolean) => {
    return text ?
      <Text
        style={[styles.text, isActive && styles.active]}
      >
        {text}
      </Text> :
      null
  }

  getItemLayout = (data, index) => {
    const LINE_HEIGHT = Number(this.props.lineHeight)
    return {
      length: LINE_HEIGHT,
      offset: LINE_HEIGHT * index,
      index
    }
  }

  keyExtractor = (data, index) => index

  mapFlatlist = (component) => ( this.Flatlist = component )

  render() {
    return (
      <View style={styles.container} onTouchStart={this.onTouch}>
        {
          this.props.refreshing ?
            <ActivityIndicator animating size='large'/> :
            <FlatList
              // tslint:disable-next-line:jsx-no-lambda
              ref={this.mapFlatlist}
              data={this.lyricList}
              renderItem={this.renderItem}
              getItemLayout={this.getItemLayout}
              keyExtractor={this.keyExtractor}
              extraData={this.state.currentIndex}
              refreshing={this.props.refreshing}
            />
        }
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
  } as TextStyle,
  text: {
    textAlign: 'center',
    lineHeight: 17
  } as TextStyle,
  container: {
    flex: 1,
    marginHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center'
  } as ViewStyle
}
