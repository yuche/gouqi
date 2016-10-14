import * as React from 'react'
import {
  View,
  TouchableHighlight,
  Image,
  Text,
  ImageStyle,
  StyleSheet,
  TextStyle,
  ViewStyle
} from 'react-native'

interface IListItem {
  picURI: string,
  containerStyle?: ViewStyle,
  wrapperStyle?: ViewStyle,
  picStyle?: ImageStyle,
  title: string,
  titleStyle?: TextStyle,
  subTitle?: string,
  subTitleStyle?: TextStyle,
  roundPic?: boolean,
  onPress?: any
}

const ListItem = ({
  picURI,
  containerStyle,
  wrapperStyle,
  picStyle,
  title,
  titleStyle,
  subTitle,
  subTitleStyle,
  roundPic = false,
  onPress
}: IListItem) => {
  const subTitleComp = (
    <Text style={[styles.subTitle, subTitleStyle && subTitleStyle]}>
      { subTitle }
    </Text>
  )
  return <TouchableHighlight
    style={[styles.container, containerStyle && containerStyle]}
    onPress={onPress}
  >
    <View style={[styles.wrapper, containerStyle && wrapperStyle]}>
      <Image
        resizeMode='contain'
        source={{uri: picURI}}
        style={[styles.pic, roundPic && { borderRadius : 17}, picStyle && picStyle]}
      />
      <View style={styles.titleContainer}>
        <Text style={[styles.title, titleStyle && titleStyle]}>
          { title }
        </Text>
        {subTitle && subTitleComp}
      </View>
    </View>
  </TouchableHighlight>
}

const styles = StyleSheet.create({
  pic: {
    width: 40,
    height: 40
  } as ImageStyle,
  container: {
    padding: 10,
    borderBottomColor: '#ededed',
    borderBottomWidth: 1,
    backgroundColor: 'white'
  } as ViewStyle,
  wrapper: {
    flexDirection: 'row'
  } as ViewStyle,
  titleContainer: {
    justifyContent: 'center'
  } as ViewStyle,
  title: {
    fontSize: 14,
    fontWeight: '100',
    marginLeft: 10
  } as TextStyle,
  subTitle: {
    fontSize: 12,
    marginTop: 1,
    fontWeight: '100',
    marginLeft: 10,
    color: '#ccc'
  } as TextStyle
})

export default ListItem
