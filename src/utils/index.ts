import {
    AsyncStorage
} from 'react-native'
import { ITrack } from '../services/api'
import RNFS from 'react-native-fs'

export const DOWNLOADED_TRACKS = 'DOWNLOADED_TRACKS'

export const PLACEHOLDER_IMAGE = 'http://p4.music.126.net/VnZiScyynLG7atLIZ2YPkw==/18686200114669622.jpg?param=30y30'

export const FILES_FOLDER = `${RNFS.DocumentDirectoryPath}/files`

export async function getDownloadedTracks (): Promise<ITrack[]> {
  const tracks = await AsyncStorage.getItem(DOWNLOADED_TRACKS)
  return tracks ? JSON.parse(tracks) : []
}

export function assign<A extends B, B extends Object>(source: A, assignments: B): A {
  return Object.assign({}, source, assignments)
}

export function changeCoverImgUrl (arr, width = 300) {
  return arr.map(item => ({
    ...item,
    coverImgUrl: `${item.coverImgUrl}?param=${width}y${width}`
  }))
}

export function playCount (num: number) {
  const n = num || 0
  if (n < 100000) {
    return n + ' 次播放' // space matters
  }
  return Math.round(n / 10000) + ' 万次播放'
}
