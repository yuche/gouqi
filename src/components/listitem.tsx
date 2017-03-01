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
  subTitle?: string | JSX.Element | null,
  subTitleStyle?: TextStyle,
  roundPic?: boolean,
  subTitleContainerStyle?: ViewStyle,
  mainTitleContainerStyle?: ViewStyle,
  noBorder?: boolean,
  numeberOfLines?: number,
  renderLeft?: JSX.Element,
  renderRight?: JSX.Element,
  onPress?: (e?: any) => void
}

class ListItem extends React.Component<IListItem, any> {

  constructor (props: IListItem) {
    super(props)
  }

  render () {
    const {
      picURI,
      containerStyle,
      wrapperStyle,
      picStyle,
      title,
      titleStyle,
      subTitle,
      subTitleStyle,
      roundPic = false,
      noBorder = false,
      subTitleContainerStyle,
      mainTitleContainerStyle,
      numeberOfLines = 1,
      renderLeft,
      renderRight,
      onPress
    } = this.props
    const Component = onPress ? TouchableHighlight : View
    return (
      <Component
        activeOpacity={0.3}
        underlayColor='whitesmoke'
        style={[styles.container, containerStyle && containerStyle, noBorder && { borderBottomWidth: 0 }]}
        onPress={onPress}
      >
        <View style={[styles.wrapper, wrapperStyle && wrapperStyle]}>
          { this.renderLeft(picURI, roundPic, picStyle, renderLeft) }
          <View style={styles.titleContainer}>
            <View style={[mainTitleContainerStyle && mainTitleContainerStyle]}>
              <Text style={[styles.title, titleStyle && titleStyle]} numberOfLines={numeberOfLines} onPress={onPress}>
                { title }
              </Text>
            </View>
            { this.renderSubtitle(subTitle, subTitleStyle, subTitleContainerStyle) }
          </View>
          { renderRight && renderRight }
        </View>
      </Component>
    )
  }

  renderLeft (picURI?: string, roundPic?: boolean, picStyle?: ViewStyle, renderLeft?: JSX.Element) {
    const borderRadius = { borderRadius : picStyle && picStyle.height ? picStyle.height / 2 : 20 }
    if (picURI) {
      return <Image
        resizeMode='contain'
        source={{uri: picURI}}
        style={[styles.pic, roundPic && borderRadius, picStyle && picStyle]}
      />
    }
    if (renderLeft) {
      return renderLeft
    }
  }

  renderSubtitle (
    subTitle?: string | JSX.Element | null,
    subTitleStyle?: ViewStyle,
    subTitleContainer?: ViewStyle
  ) {
    if (subTitle && typeof subTitle === 'string') {
      return (
        <View style={[ subTitleContainer && subTitleContainer ]}>
          <Text style={[styles.subTitle, subTitleStyle && subTitleStyle]} numberOfLines={1}>
            { subTitle }
          </Text>
        </View>
      )
    }

    return subTitle
  }
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
    flex: 1,
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
    color: '#bbb'
  } as TextStyle
})

export default ListItem
