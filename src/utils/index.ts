import {
    AsyncStorage
} from 'react-native'
import { ITrack } from '../services/api'
import * as RNFS from 'react-native-fs'
import { ILyric } from '../interfaces'

export const DOWNLOADED_TRACKS = 'DOWNLOADED_TRACKS'

export const PLACEHOLDER_IMAGE = 'http://p4.music.126.net/VnZiScyynLG7atLIZ2YPkw==/18686200114669622.jpg?param=30y30'

export const FILES_FOLDER = `${RNFS.DocumentDirectoryPath}/files`

export async function getDownloadedTracks (): Promise<ITrack[]> {
  const tracks = await AsyncStorage.getItem(DOWNLOADED_TRACKS)
  return tracks ? JSON.parse(tracks) : []
}

export function assign<A extends B, B extends {}> (source: A, assignments: B): A {
  return Object.assign({}, source, assignments)
}

export function changeCoverImgUrl (arr, width = 300) {
  return arr.map((item) => ({
    ...item,
    coverImgUrl: item.coverImgUrl && `${item.coverImgUrl}?param=${width}y${width}`,
    picUrl: item.picUrl && `${item.picUrl}?param=${width}y${width}`,
    img1v1Url: item.img1v1Url && `${item.img1v1Url}?param=${width}y${width}`
  }))
}

export function playCount (num: number) {
  const n = num || 0
  if (n < 100000) {
    return n + ' 次播放' // space matters
  }
  return Math.round(n / 10000) + ' 万次播放'
}

function parseLyric (lyric: string) {
  return lyric
    .split('\n')
    .reduce((arr: ILyric[], str: string) => {
      return [...arr, ...parseLrcText(str)]
    }, [] as ILyric[])
    .sort((a, b) => {
      return a.time - b.time
    })
}

export function parseLyrics (s1: string, s2?: string) {
  const original = parseLyric(s1)
  if (!s2) {
    return original
  }
  const translations = parseLyric(s2)
  return original.map(({ time, text }) => {
    const lrc = translations.find((t) => t.time === time)
    const translation = lrc ? lrc.text : ''
    return {
      time,
      text,
      translation
    }
  })
}

function parseLrcText (str: string) {
  const times = str.match(/\[(\d{2}):(\d{2})\.(\d{2,3})]/g)
  const text = str
    .replace(/\[(\d{2}):(\d{2})\.(\d{2,3})]/g, '')
    .replace(/^\s+|\s+$/g, '')
  if (!text) {
    return []
  }
  return times ? parseMutipleTime(times).map((time) => ({ ...time, text })) : []
}

function parseMutipleTime (times: string[]) {
  return times.reduce((arr, str) => {
    const clock = /\[(\d{2}):(\d{2})\.(\d{2,3})]/.exec(str)
    return clock
      ? [...arr, {
        time: Number(clock[1]) * 60 +
        parseInt(clock[2], 10) +
        parseInt(clock[3], 10) / ((clock[3] + '').length === 2 ? 100 : 1000)
      }]
      : []
  }, [] as Array<{
    time: number
  }>)
}
