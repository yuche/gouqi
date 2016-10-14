import * as React from 'react'
import { View, StyleSheet, ViewStyle } from 'react-native'

const List = ({
  children,
  containerStyle
}: {
  children?: JSX.Element,
  containerStyle?: ViewStyle
}) => (
  <View style={[styles.listContainer, containerStyle && containerStyle]}>
    {children}
  </View>
)

const styles = StyleSheet.create({
  listContainer: {
    marginTop: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#cbd2d9'
  } as ViewStyle
})

export default List
