// tslint:disable-next-line:no-var-requires
const { createIconSet } = require('react-native-vector-icons')

const glyphMap = {
  artist: '\ue61d',
  album: '\ue628',
  star: '\ue600',
  comment: '\ue620',
  collect: '\ue69a',
  more: '\ue607',
  info: '\ue626',
  'star-o': '\ue64d',
  download: '\ue820'
}

export default createIconSet(glyphMap, 'iconfont')
