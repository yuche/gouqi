import * as React from 'react'
import {
  View,
  Text,
  ViewStyle,
  TextStyle,
  FlatList,
  FlatListStatic,
  ActivityIndicator
} from 'react-native'
import { isEmpty, findIndex } from 'lodash'
import { ILyric } from '../interfaces'

interface IProps {
  lyrics: ILyric[],
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

  private Flatlist: FlatListStatic<any>

  constructor (props: IProps) {
    super(props)
    this.state = {
      currentIndex: 0
    }
  }

  componentWillReceiveProps ({ currentTime, lyrics, lineHeight, refreshing }: IProps) {
    const {
      currentIndex
    } = this.state
    if (
      currentTime !== this.props.currentTime
      && !isEmpty(this.props.lyrics)
      && !refreshing
    ) {
      const index = findIndex(this.props.lyrics, (lrc, i) => {
        const next = this.props.lyrics[i + 1]
        return lrc.time >= currentTime &&
          (!next || currentTime < next.time)
      }) - 1
      if ( currentIndex !== index) {
        const isIndexValid = index >= 0
        // this.lyricList = this.lyricList.slice()
        this.setState({
          currentIndex: isIndexValid ? index : this.props.lyrics.length - 1
        })
        if (!this.isScrolling && isIndexValid && this.Flatlist) {
          // scroll to
          this.Flatlist.scrollToIndex({
            animated: true,
            index: index + 1,
            viewPosition: .5
          })
        }
      }
    }
  }

  componentWillUnmount () {
    this.clearTimer()
  }

  clearTimer () {
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
      // tslint:disable-next-line:jsx-wrap-multiline
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

  render () {
    return (
      <View style={styles.container} onTouchStart={this.onTouch}>
        {
          this.props.refreshing ?
            <ActivityIndicator animating={true} size='large'/> :
            <FlatList
              ref={this.mapFlatlist}
              data={this.props.lyrics}
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
