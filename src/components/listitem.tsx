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
  picURI?: string,
  containerStyle?: ViewStyle,
  wrapperStyle?: ViewStyle,
  picStyle?: ImageStyle,
  title: string,
  titleStyle?: TextStyle,
  subTitle?: string,
  subTitleStyle?: TextStyle,
  roundPic?: boolean,
  onPress?: (e?: any) => void,
  fuck?: string
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
  onPress,
  fuck
}: IListItem) => {
  const Component = onPress ? TouchableHighlight : View

  const SubTitleComp = subTitle &&
    <Text style={[styles.subTitle, subTitleStyle && subTitleStyle]}>
      { subTitle }
    </Text>

  const Picture = picURI &&
    <Image
      resizeMode='contain'
      source={{uri: picURI}}
      style={[styles.pic, roundPic && { borderRadius : picStyle ? picStyle.height / 2 : 20 }, picStyle && picStyle]}
    />

  return <Component
    style={[styles.container, containerStyle && containerStyle]}
    onPress={onPress}
  >
    <View style={[styles.wrapper, containerStyle && wrapperStyle]}>
      { Picture }
      <View style={styles.titleContainer}>
        <Text style={[styles.title, titleStyle && titleStyle]} numberOfLines={1} onPress={onPress}>
          { title }
        </Text>
        { SubTitleComp }
      </View>
    </View>
  </Component>
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
    flexDirection: 'column',
    justifyContent: 'space-between'
  } as ViewStyle,
  title: {
    fontSize: 15,
    fontWeight: '100',
    marginLeft: 10
  } as TextStyle,
  subTitle: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '100',
    marginLeft: 10,
    color: '#ccc'
  } as TextStyle
})

export default ListItem
