import React from 'react'
import {
  Text,
  TextInput,
  View
} from 'react-native'

export default class Login extends React.Component<any, any> {
  public render() {
    return (
      <View style={{padding: 10}}>
        <TextInput />
        <Text>登录</Text>
      </View>
    )
  }
}
