// most of api from @darknessomi/musicbox
// https://github.com/darknessomi/musicbox/blob/master/NEMbox/api.py

import {
  encryptedMD5,
  encryptedRequest
} from './crypto'
import {
  getCookies,
  getCsrfFromCookies,
  request
} from './request'

function getUserId(): string | null {
  const cookies = getCookies()
  const uids = /\d+/.exec(cookies.split(';')[3])
  return uids ? uids[0] : null
}

interface ILoginBody {
  password: string,
  rememberLogin: string,
  phone?: string,
  username?: string
}

export async function login(username: string, password: string) {
  const patten = /^0\d{2,3}\d{7,8}$|^1[34578]\d{9}$/
  let url = '/weapi/login/'
  let body: ILoginBody = {
    password: encryptedMD5(password),
    rememberLogin: 'true'
  }
  if (patten.test(username)) {
    body.phone = username
    url = '/weapi/login/cellphone/'
  } else {
    body.username = username
  }
  return await request.post(url, encryptedRequest(body))
}

export async function userPlayList(
  uid = getUserId(),
  offset = '0',
  limit = '100',
  total = true
) {
  return await request.get('/api/user/playlist/'
    + `?uid=${uid}&offset=${offset}&limit=${limit}&total=${total}`)
}

export async function playListDetail(id: string) {
  return await request.get(`/api/playlist/detail?id=${id}`)
}

export const enum SearchType {
  song = 1,
  artist = 100,
  album = 10,
  playList = 1000,
  user = 1002
}

export async function search(
  s: string,
  type: SearchType | string,
  limit = '20',
  offset = '0',
  total = 'true'
) {
  return await request.post('/api/search/get/web', {
    s, type, offset, limit, total
  })
}

export async function recommendPlayList(
  offset = '0',
  limit = '20',
  total = 'true'
) {
  const csrf = getCsrfFromCookies()
  if (!csrf) {
    return null
  }
  return await request
    .post('/weapi/v1/discovery/recommend/songs?csrf_token=' + csrf, encryptedRequest({
      offset, limit, total,
      'csrf-token': csrf
    })
    )
}

export async function personalFM() {
  return await request.get('/api/radio/get')
}

export async function fmLike(
  songId: string,
  like = true,
  time = '25',
  alg = 'itembased'
) {
  return await request
    .get(`/api/radio/like?alg=${alg}&trackId=${songId}&like=${like}&time=${time}`)
}

export async function fmTrash(
  songId: string,
  time = '25',
  alg = 'RT'
) {
  return await request
    .get(`/api/radio/trash/add?alg=${alg}&songId=${songId}&time=${time}`)
}

export async function newAlbums(
  offset = '0',
  limit = '10'
) {
  return await request
    .get(`/api/album/new?area=ALL&offset=${offset}&total=true&limit=${limit}`)
}

export interface IPlaylist {
  coverImgUrl: string,
  creator: IUser,
  subscribedCount: number,
  name: string,
  playCount: number,
  id: number,
  commentCount: number,
  commentThreadId: string,
  description: string,
  subscribed: boolean,
  subscribing: boolean,
  tracks: ITrack[]
}

export interface IUser {
  avatarUrl: string,
  backgroundUrl: string,
  gender: number,
  nickname: string,
  signature: string
}

export interface ITrack {
  album: IAlbum,
  artists: IArtist[],
  commentThreadId: string,
  mp3Url: string,
  name: string,
  id: string
}

export interface IAlbum {
  id: number,
  company: string,
  description: string,
  name: string,
  picUrl: string,
  size: string
}

export interface IArtist {
  picUrl: string,
  id: number,
  name: string,

}

export interface ItopPlayListResult {
  code: number,
  more: boolean,
  total: number,
  playlists: IPlaylist[]
}

export async function topPlayList(
  limit = '10',
  offset = '0',
  category = '全部',
  order = 'hot',
  total = true,
): Promise<ItopPlayListResult> {
  return await request
    .get(`/api/playlist/list?cat=${category}&order=${order}&offset=${offset}&total=${offset}&limit=${limit}`)
}

export async function topArtists(
  offset = '0',
  limit = '10'
) {
  return await request
    .get(`/api/artist/top?offset=${offset}&total=false&limit=${limit}`)
}

export async function artistInfo(
  artistId: string
) {
  return await request
    .get(`/api/artist/${artistId}`)
}

export async function albumInfo(
  albumId: string
) {
  return await request
    .get(`/api/album/${albumId}`)
}

export const enum ChannelsType {
  today = 0, // 今日最热
  week = 10,
  history = 20,
  recent = 30
}

export async function djChannels(
  type: ChannelsType | string,
  offset = '0',
  limit = '10'
): Promise<string[]> {
  const body = await request
    .get(`/discover/djradio?type=${type}&offset=${offset}&limit=${limit}`)
  const matchChannels = [...body.match(/program\?id=\d+/g)]
  return [...new Set(matchChannels)].map(c => c.slice(11))
}

export async function channelDetails(channelId: string) {
  return await request.get(`/api/dj/program/detail?id=${channelId}`)
}

export async function singleSongDetails(songId: string) {
  return await request
    .get(`/api/song/detail/?id=${songId}&ids=[${songId}]`)
}

export async function batchSongDetails(songIds: string[]) {
  return await request
    .get(`/api/song/detail?ids=[${songIds.join()}]`)
}

export async function batchSongDetailsNew(
  songIds: string[],
  bitrate = '320000'
) {
  const csrf = getCsrfFromCookies()
  if (!csrf) {
    return null
  }
  return await request
    .post(`/weapi/song/enhance/player/url?csrf_token=${csrf}`, encryptedRequest({
      br: bitrate,
      ids: songIds,
      'csrf_token': csrf
    }))
}

export async function opMuiscToPlaylist(
  tracks: string,
  pid: string,
  op: 'add' | 'del'
) {
  return await request
    .post(`/api/playlist/manipulate/tracks`, {
      tracks,
      trackIds: `[${tracks}]`,
      pid,
      op
    })
}

export async function setMusicFavorite(
  trackId: string,
  like: boolean | string,
  time = '0'
) {
  return await request
    .post(`/api/song/like`, {
      trackId,
      like,
      time
    })
}

export async function createPlaylist(
  name: string
) {
  const uid = getUserId()
  const csrf = getCsrfFromCookies()
  if (!uid) {
    return null
  }
  return await request
    .post(`/weapi/playlist/create?csrf_token=${csrf}`, encryptedRequest({
      name,
      uid
    }))
}

export async function deletePlaylist(
  pid: string
) {
  const csrf = getCsrfFromCookies()
  if (!csrf) {
    return null
  }
  return await request
    .post(`/weapi/playlist/delete?csrf_token=${csrf}`, encryptedRequest({
      id: pid,
      pid
    }))
}

export async function subscribePlaylist(pid: string, subscribe = true) {
  const csrf = getCsrfFromCookies()
  if (!csrf) {
    return null
  }
  const prefix = subscribe ? '' : 'un'
  return await request
    .post(`/weapi/playlist/${prefix}subscribe/?csrf_token=${csrf}`, encryptedRequest({
      id: pid,
      pid
    }))
}

// export async function updatePlaylist (
//   pid: string,
//   name: string
// ) {
//   const csrf = getCsrfFromCookies()
//   if (!csrf) {
//     return null
//   }
//   return await request
//     .post(`/weapi/playlist/delete?csrf_token=${csrf}`, {
//       body: qs.stringify(
//         encryptedRequest({
//         id: pid,
//         name
//       })
//       )
//     })
// }
