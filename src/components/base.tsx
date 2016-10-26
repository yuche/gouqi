import * as React from 'react'
import {
  Text,
  TextStyle,
  View,
  ViewStyle,
  TextInput,
  StyleSheet,
  TextInputProperties,
  TouchableHighlight
} from 'react-native'
import {
  Color
} from '../styles'
// tslint:disable-next-line
const Icon = require('react-native-vector-icons/FontAwesome')

type Ref = string | ((instance: any) => any)

interface IForm extends TextInputProperties {
  icon: string,
  containerStyle?: ViewStyle,
  wrapperStyle?: ViewStyle,
  inputRef?: Ref,
  onClear?: () => void
 }

 interface IFormStates {
   text: string,
   focus: boolean
 }

export class Form extends React.Component<IForm, IFormStates> {
  constructor(props: IForm) {
    super(props)
  }

  render () {
    const {
      containerStyle = {},
      wrapperStyle = {},
      icon,
      placeholder,
      editable,
      onChangeText,
      value,
      secureTextEntry,
      onClear,
      onSubmitEditing,
      autoCorrect = false,
      autoCapitalize,
      autoFocus = false,
      inputRef
    } = this.props

    const clearIcon = () => {
      return value ?
        <Icon name='times-circle' size={14} color='#bbb' onPress={onClear}/>
        :
        null
    }
    return <View style={[styles.formContainer, containerStyle]}>
      <View style={styles.formOutterWrapper}>
        <View style={[styles.formInnerWrapper, wrapperStyle]}>
          <Icon name={icon} size={14} color='#ccc'/>
          <TextInput
            ref={inputRef}
            autoCapitalize={autoCapitalize}
            autoCorrect={autoCorrect}
            autoFocus={autoFocus}
            style={styles.searchInput}
            placeholder={placeholder}
            editable={editable}
            onChangeText={onChangeText}
            secureTextEntry={secureTextEntry}
            value={value}
            onSubmitEditing={onSubmitEditing}
          />
          {clearIcon()}
        </View>
      </View>
    </View>
  }
}

interface IButtonProps {
  disabled?: boolean,
  children?: JSX.Element | string,
  onPress?: () => void
}

export const Button = ({
  disabled = false,
  children,
  onPress
}: IButtonProps) => {
  return (
    <TouchableHighlight
      style={[styles.buttonContainer]}
      onPress={onPress}
    >
      <Text
        style={[styles.buttonText, !disabled && styles.buttonDisabled]}
      >
        {children}
      </Text>
    </TouchableHighlight>
  )
}

const styles = StyleSheet.create({
  formContainer: {
    padding: 10,
    paddingTop: 5,
    paddingBottom: 5
  } as ViewStyle,
  formInnerWrapper: {
    flexDirection: 'row',
    padding: 10
  } as ViewStyle,
  formOutterWrapper: {
    position: 'relative',
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E6E6EA',
    borderRadius: 5
  } as ViewStyle,
  searchInput: {
    marginLeft: 5,
    flex: 1,
    fontSize: 14
  } as TextStyle,
  clearIcon: {
    width: 20
  } as TextStyle,
  buttonContainer: {
    backgroundColor: Color.main,
    margin: 10,
    marginBottom: 5,
    marginTop: 5,
    borderRadius: 5
  } as ViewStyle,
  buttonDisabled: {
    color: '#ddd'
  } as TextStyle,
  buttonText: {
    padding: 10,
    borderRadius: 5,
    textAlign: 'center',
    color: 'white'
  } as TextStyle
})
