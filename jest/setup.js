/* eslint-env node, jest */
jest.mock('Linking', () => {
  return {
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    openURL: jest.fn(),
    canOpenURL: jest.fn(),
    getInitialURL: jest.fn()
  }
})

jest.mock('react-native-video', () => 'Video')
jest.mock('react-native-interactable', () => 'Interactable')
jest.mock('react-native-music-control', () => 'MusicControl')
jest.mock('react-native-vector-icons', () => 'Icons')
jest.mock('react-native-fs', () => 'fs')
