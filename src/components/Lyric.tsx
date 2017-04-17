import * as React from 'react'
import {
  View,
  Text,
  ViewStyle,
  TextStyle,
  ScrollView
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
  lyrics: ILyric[],
  currentTime: number
}

interface IState {
  index: number
}

const LYRICS = parseLrc('[00:00.00] 作曲 : 赵雷\n[00:01.00] 作词 : 赵雷\n[00:16.75]让我掉下眼泪的 不止昨夜的酒\n[00:25.91]让我依依不舍的 不止你的温柔\n[00:33.91]余路还要走多久 你攥着我的手\n[00:41.70]让我感到为难的 是挣扎的自由\n[00:52.10]分别总是在九月 回忆是思念的愁\n[00:59.63]深秋嫩绿的垂柳 亲吻着我额头\n[01:07.53]在那座阴雨的小城里 我从未忘记你\n[01:15.41]成都 带不走的 只有你\n[01:23.69]和我在成都的街头走一走\n[01:31.08]直到所有的灯都熄灭了也不停留\n[01:39.69]你会挽着我的衣袖 我会把手揣进裤兜\n[01:47.08]走到玉林路的尽头 坐在(走过)小酒馆的门口\n[02:30.37]分别总是在九月 回忆是思念的愁\n[02:38.10]深秋嫩绿的垂柳 亲吻着我额头\n[02:46.13]在那座阴雨的小城里 我从未忘记你\n[02:54.02]成都 带不走的 只有你\n[03:02.34]和我在成都的街头走一走\n[03:10.41]直到所有的灯都熄灭了也不停留\n[03:18.34]你会挽着我的衣袖 我会把手揣进裤兜\n[03:25.51]走到玉林路的尽头 坐在(走过)小酒馆的门口\n[04:35.96][03:35.40]和我在成都的街头走一走\n[04:42.76][03:45.39]直到所有的灯都熄灭了也不停留\n[03:53.62]和我在成都的街头走一走\n[04:01.35]直到所有的灯都熄灭了也不停留\n[04:08.95]你会挽着我的衣袖 我会把手揣进裤兜\n[04:17.27]走到玉林路的尽头 坐在(走过)小酒馆的门口\n')

export default class Lyrics extends React.Component<IProps, IState> {

  private isScrolling: boolean = false

  private timer: number

  constructor(props) {
    super(props)
  }

  componentWillReceiveProps ({ currentTime }: IProps) {
    const {
      lyrics
    } = this.props
    if (currentTime !== this.props.currentTime
      && !isEmpty(lyrics)) {
      const index = findIndex(lyrics, lrc => lrc.time >= currentTime)
      this.setState({
        index
      })
      if (!this.isScrolling) {
        // scroll to
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

  onScroll = () => {
    this.clearTimer()
    this.isScrolling = true
    this.timer = setTimeout(() => {
      this.isScrolling = false
    }, 2000)
  }

  renderLrc ({ time, text }: ILyric, index: number) {
    return (
      <View style={styles.lrc}>
        <Text>
          {text}
        </Text>
      </View>
    )
  }

  render() {
    return (
      <View style={{ flex: 1 }}>

      </View>
    )
  }
}

const styles = {
  lrc: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center'
  } as ViewStyle
}
