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
jest.mock('react-native-music-control', () => ({
  updatePlayback () {
    return ''
  },
  STATE_PLAYING: '',
  STATE_PAUSED: ''
}))
jest.mock('react-native-fs', () => ({
  DocumentDirectoryPath: '',
  mkdir () {
    return ''
  },
  stopDownload () {
    return ''
  },
  unlink () {
    return ''
  },
  readDir () {
    return ''
  },
  downloadFile ({ begin, progress, fromUrl }) {
    return {
      promise: new Promise((resovle, reject) => {
        begin({ jobId: 1 })
        progress({contentLength: 10e8, bytesWritten: 10e7})
        if (!fromUrl) {
          throw new Error('fake err')
        }
        resovle(0)
      })
    }
  }
}))
