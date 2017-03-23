import * as React from 'react'
import { TOP_LIST } from '../services/api'
import {
  View,
  Image,
  Text,
  TextStyle,
  ViewStyle,
  Dimensions,
  ScrollView,
  TouchableWithoutFeedback
 } from 'react-native'
import Router from '../routers'

const { width } = Dimensions.get('window')

interface IProps {
  tabLabel: string
}

class Toplist extends React.Component<IProps, any> {

  private toplist: any[]

  constructor(props: IProps) {
    super(props)
    this.toplist = TOP_LIST
    this.toplist = this.toplist.map(list => {
      return {
        ...list,
        creator: {
          nickname: '网易云音乐',
          avatarUrl: 'http://p1.music.126.net/QWMV-Ru_6149AKe0mCBXKg==/1420569024374784.jpg'
        },
        description: '',
        commentThreadId: `A_PL_0_${list.id}`,
        subscribedCount: 0,
        playCount: 0,
        coverImgUrl: list.imgUrl
      }
    })
  }

  renderItem = (item, index: number) => {
    const isMiddle = (index + 1) % 3 === 2
    return (
      <TouchableWithoutFeedback
        key={item.id}
        onPress={Router.toPlayList({route: item})}
      >
        <View
          style={[styles.item, isMiddle && { marginHorizontal: 5 }]}
        >
          <Image
            style={styles.image}
            source={{uri: item.coverImgUrl}}
          />
          {item.meta && <Text style={styles.meta}>{item.meta}</Text>}
          <Text style={styles.title} numberOfLines={2}>{item.name}</Text>
          {item.subtitle && <Text style={styles.subtitle}>{item.subtitle}</Text>}
        </View>
      </TouchableWithoutFeedback>
    )
  }

  render() {
    return (
      <ScrollView style={{flex: 1}}>
        <View style={styles.container}>
          {this.toplist.map(this.renderItem)}
        </View>
      </ScrollView>
    )
  }

}

const gridWidth = ( width - 10 ) / 3

const styles = {
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start'
  } as ViewStyle,
  item: {
    width: gridWidth,
    marginBottom: 15
  } as ViewStyle,
  image: {
    width: gridWidth,
    height: gridWidth
  },
  meta: {
    position: 'absolute',
    top: gridWidth - 20,
    color: 'white',
    backgroundColor: 'transparent',
    left: 5,
    fontSize: 13
  } as TextStyle,
  title: {
    marginLeft: 5,
    marginTop: 5
  } as TextStyle,
  subtitle: {
    marginLeft: 5,
    marginTop: 5,
    fontSize: 13,
    color: '#eee'
  } as TextStyle
}

export default Toplist
