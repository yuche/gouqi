// most of api from @darknessomi/musicbox
// https://github.com/darknessomi/musicbox/blob/master/NEMbox/api.py
/**
 * TODO:
 * 修改 API params 为 Object
 */
import {
  encryptedMD5,
  encryptedRequest
} from './crypto'
import {
  getCookies,
  getCsrfFromCookies,
  request
} from './request'

// 排行榜数据可以从这里更新
// 详情： https://gist.github.com/yuche/f7f3c3b0bc14517eacc27a065d7c5b19
export const TOP_LIST = [
  {
    'name': '云音乐飙升榜',
    'id': '19723756',
    'imgUrl': 'http://p3.music.126.net/DrRIg6CrgDfVLEph9SNh7w==/18696095720518497.jpg',
    'meta': '每天更新'
  },
  {
    'name': '云音乐新歌榜',
    'id': '3779629',
    'imgUrl': 'http://p4.music.126.net/N2HO5xfYEqyQ8q6oxCw8IQ==/18713687906568048.jpg',
    'meta': '每天更新'
  },
  {
    'name': '网易原创歌曲榜',
    'id': '2884035',
    'imgUrl': 'http://p3.music.126.net/sBzD11nforcuh1jdLSgX7g==/18740076185638788.jpg',
    'meta': '每周四更新'
  },
  {
    'name': '云音乐热歌榜',
    'id': '3778678',
    'imgUrl': 'http://p3.music.126.net/GhhuF6Ep5Tq9IEvLsyCN7w==/18708190348409091.jpg',
    'meta': '每周四更新'
  },
  {
    'name': '云音乐电音榜',
    'id': '10520166',
    'imgUrl': 'http://p3.music.126.net/4mh2HWH-bd5sRufQb-61bg==/3302932937414659.jpg',
    'meta': '每周五更新'
  },
  {
    'name': '云音乐ACG音乐榜',
    'id': '71385702',
    'imgUrl': 'http://p4.music.126.net/vttjtRjL75Q4DEnjRsO8-A==/18752170813539664.jpg',
    'meta': '每周四更新'
  },
  {
    'name': 'Beatport全球电子舞曲榜',
    'id': '3812895',
    'imgUrl': 'http://p3.music.126.net/A61n94BjWAb-ql4xpwpYcg==/18613632348448741.jpg',
    'meta': '每周四更新'
  },
  {
    'name': '日本Oricon周榜',
    'id': '60131',
    'imgUrl': 'http://p3.music.126.net/Rgqbqsf4b3gNOzZKxOMxuw==/19029247741938160.jpg',
    'meta': '每周三更新'
  },
  {
    'name': '云音乐古典音乐榜',
    'id': '71384707',
    'imgUrl': 'http://p3.music.126.net/BzSxoj6O1LQPlFceDn-LKw==/18681802069355169.jpg',
    'meta': '每周四更新'
  },
  {
    'name': 'UK排行榜周榜',
    'id': '180106',
    'imgUrl': 'http://p4.music.126.net/VQOMRRix9_omZbg4t-pVpw==/18930291695438269.jpg',
    'meta': '每周一更新'
  },
  {
    'name': '美国Billboard周榜',
    'id': '60198',
    'imgUrl': 'http://p3.music.126.net/EBRqPmY8k8qyVHyF8AyjdQ==/18641120139148117.jpg',
    'meta': '每周三更新'
  },
  {
    'name': '法国 NRJ Vos Hits 周榜',
    'id': '27135204',
    'imgUrl': 'http://p4.music.126.net/6O0ZEnO-I_RADBylVypprg==/109951162873641556.jpg',
    'meta': '每周五更新'
  },
  {
    'name': 'iTunes榜',
    'id': '11641012',
    'imgUrl': 'http://p4.music.126.net/83pU_bx5Cz0NlcTq-P3R3g==/18588343581028558.jpg',
    'meta': '每周一更新'
  },
  {
    'name': 'Hit FM Top榜',
    'id': '120001',
    'imgUrl': 'http://p3.music.126.net/54vZEZ-fCudWZm6GH7I55w==/19187577416338508.jpg',
    'meta': '每周一更新'
  },
  {
    'name': 'KTV唛榜',
    'id': '21845217',
    'imgUrl': 'http://p4.music.126.net/H4Y7jxd_zwygcAmPMfwJnQ==/19174383276805159.jpg',
    'meta': '每周五更新'
  },
  {
    'name': '台湾Hito排行榜',
    'id': '112463',
    'imgUrl': 'http://p4.music.126.net/wqi4TF4ILiTUUL5T7zhwsQ==/18646617697286899.jpg',
    'meta': '每周一更新'
  },
  {
    'name': '中国TOP排行榜（港台榜）',
    'id': '112504',
    'imgUrl': 'http://p3.music.126.net/JPh-zekmt0sW2Z3TZMsGzA==/18967675090783713.jpg',
    'meta': '每周一更新'
  },
  {
    'name': '中国TOP排行榜（内地榜）',
    'id': '64016',
    'imgUrl': 'http://p3.music.126.net/2klOtThpDQ0CMhOy5AOzSg==/18878614648932971.jpg',
    'meta': '每周一更新'
  },
  {
    'name': '香港电台中文歌曲龙虎榜',
    'id': '10169002',
    'imgUrl': 'http://p4.music.126.net/YQsr07nkdkOyZrlAkf0SHA==/18976471183805915.jpg',
    'meta': '每周五更新'
  },
  {
    'name': '华语金曲榜',
    'id': '4395559',
    'imgUrl': 'http://p3.music.126.net/N2whh2Prf0l8QHmCpShrcQ==/19140298416347251.jpg',
    'meta': '每周一更新'
  },
  {
    'name': '中国嘻哈榜',
    'id': '1899724',
    'imgUrl': 'http://p4.music.126.net/8gUF9TrXGNoRO6cKVaCzrQ==/5972547162256485.jpg',
    'meta': '每周五更新'
  }
]

export function getUserId (): string | null {
  const cookies = getCookies()
  const uids = cookies.match(/uid=\d+/g)
  return uids && Array.isArray(uids)
    ? uids[0].substr(4)
    : null
}

function needLogin () {
  return getUserId() ? null : {
    error: new Error('未登录')
  }
}

interface ILoginBody {
  password: string,
  rememberLogin: string,
  phone?: string,
  username?: string
}

export interface IProfile {
  avatarUrl: string,
  userId: number,
  nickname: string
}

export async function login (username: string, password: string) {
  const patten = /^0\d{2,3}\d{7,8}$|^1[34578]\d{9}$/
  let url = '/weapi/login'
  const body: ILoginBody = {
    password: encryptedMD5(password),
    rememberLogin: 'true'
  }
  if (patten.test(username)) {
    body.phone = username
    url = '/weapi/login/cellphone'
  } else {
    body.username = username
  }
  return await request.post(url, encryptedRequest(body))
}

export async function userPlayList (
  uid = getUserId(),
  offset = '0',
  limit = '100',
  total = true
) {
  return await (needLogin() || request.get('/api/user/playlist/'
    + `?uid=${uid}&offset=${offset}&limit=${limit}&total=${total}`))
}

export async function playListDetail (id: string) {
  return await request.get(`/api/playlist/detail?id=${id}`)
}

export const enum SearchType {
  song = 1,
  artist = 100,
  album = 10,
  playList = 1000,
  user = 1002
}

export async function search (
  s: string,
  type: SearchType | string,
  limit = '30',
  offset = '0',
  total = 'true'
) {
  return await request.post('/api/search/pc', {
    s, type, offset, limit, total
  })
}

export async function dailyRecommend (
  limit = '30',
  offset = '0',
  total = 'true'
) {
  const csrf = getCsrfFromCookies()
  return await (needLogin() || request
    .post('/weapi/v1/discovery/recommend/songs?csrf_token=' + csrf, encryptedRequest({
        offset, limit, total,
        'csrf-token': csrf
    })))
}

export async function personalFM () {
  return await request.get('/api/radio/get')
}

export async function fmLike (
  songId: string,
  like = true,
  time = '25',
  alg = 'itembased'
) {
  return await request
    .get(`/api/radio/like?alg=${alg}&trackId=${songId}&like=${like}&time=${time}`)
}

export async function fmTrash (
  songId: string,
  time = '25',
  alg = 'RT'
) {
  return await request
    .get(`/api/radio/trash/add?alg=${alg}&songId=${songId}&time=${time}`)
}

export async function newAlbums (
  limit = '10',
  offset = '0'
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
  trackCount: number,
  picUrl: string,
  tracks: ITrack[]
}

export interface IUser {
  avatarUrl: string,
  backgroundUrl: string,
  gender: number,
  nickname: string,
  signature: string,
  userId: number
}

export interface ITrack {
  album: IAlbum,
  artists: IArtist[],
  commentThreadId: string,
  mp3Url: string,
  name: string,
  id: number,
}

export interface IAlbum {
  id: number,
  company: string,
  description: string,
  name: string,
  picUrl: string,
  size: string,
  artist: IArtist,
  commentThreadId: string,
  publishTime: string,
  info: {
    commentCount: string,
    likedCount: string,
    shareCount: string
  },
  songs: ITrack[]
}

export interface IArtist {
  picUrl: string,
  id: number,
  name: string,
  img1v1Url: string,
  followed: boolean
}

export interface ItopPlayListResult {
  code: number,
  more: boolean,
  total: number,
  playlists: IPlaylist[]
}

export async function topPlayList (
  limit = '10',
  offset = '0',
  category = '全部',
  order = 'hot',
  total = true
): Promise<ItopPlayListResult> {
  return await request
    .get(`/api/playlist/list?cat=${category}&order=${order}&offset=${offset}&total=${offset}&limit=${limit}`)
}

export async function topArtists (
  limit = '10',
  offset = '0'
) {
  return await request
    .get(`/api/artist/top?offset=${offset}&total=true&limit=${limit}`)
}

export async function artistInfo (
  artistId: string
) {
  return await request
    .get(`/api/artist/${artistId}`)
}

export async function albumInfo (
  albumId: string
) {
  return await request
    .get(`/api/album/${albumId}`)
}

export async function albumDetail (
  albumId: string
) {
  return await request
    .post(`/weapi/v1/album/${albumId}`, encryptedRequest({
      id: albumId
    }))
}

export const enum ChannelsType {
  today = 0, // 今日最热
  week = 10,
  history = 20,
  recent = 30
}

export async function djChannels (
  type: ChannelsType | string,
  offset = '0',
  limit = '10'
): Promise<string[]> {
  const body = await request
    .get(`/discover/djradio?type=${type}&offset=${offset}&limit=${limit}`)
  const matchChannels = [...body.match(/program\?id=\d+/g)]
  return [...new Set(matchChannels)].map((c) => c.slice(11))
}

export async function channelDetails (channelId: string) {
  return await request.get(`/api/dj/program/detail?id=${channelId}`)
}

export async function singleSongDetails (songId: string) {
  return await request
    .get(`/api/song/detail/?id=${songId}&ids=[${songId}]`)
}

export async function batchSongDetails (songIds: string[]) {
  return await request
    .get(`/api/song/detail?ids=[${songIds.join()}]`)
}

export async function getLyric (songId: string) {
  return await request
    .get(`/api/song/lyric?os=osx&id=${songId}&lv=-1&kv=-1&tv=-1`)
}

export async function batchSongDetailsNew (
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

export async function opMuiscToPlaylist (
  tracks: string | string[],
  pid: string,
  op: 'add' | 'del'
) {
  // 甩锅甩锅甩锅请注意
  // 写成也不怪我，是网易 API 接受的参数太奇葩了
  const trackIds = `[${(Array.isArray(tracks) ? tracks : [tracks.toString()]).toString()}]`
  return await (needLogin() || request
    .post(`/api/playlist/manipulate/tracks`, {
      tracks,
      trackIds,
      pid,
      op
    }))
}

export async function setMusicFavorite (
  trackId: string,
  like: boolean | string,
  time = '0'
) {
  return await (needLogin() || request
    .post(`/api/song/like`, {
      trackId,
      like,
      time
    }))
}

export async function createPlaylist (
  name: string
) {
  const uid = getUserId()
  const csrf = getCsrfFromCookies()
  return await (needLogin() || request
    .post(`/weapi/playlist/create?csrf_token=${csrf}`, encryptedRequest({
      name,
      uid
    })))
}

export async function deletePlaylist (
  pid: string
) {
  const csrf = getCsrfFromCookies()
  return await (needLogin() || request
    .post(`/weapi/playlist/delete?csrf_token=${csrf}`, encryptedRequest({
      id: pid,
      pid
    })))
}

export async function subscribePlaylist (pid: string, subscribe = true) {
  const csrf = getCsrfFromCookies()
  const prefix = subscribe ? '' : 'un'
  return await (needLogin() || request
    .post(`/weapi/playlist/${prefix}subscribe/?csrf_token=${csrf}`, encryptedRequest({
      id: pid,
      pid
    })))
}

export async function subscribeArtist (id: string) {
  return await(needLogin() || request
    .post(`/weapi/artist/sub`, encryptedRequest({ artistId: id }))
  )
}

export async function unsubscribeArtist (ids: string[] | string) {
  return await(needLogin() || request
    .post(`/weapi/artist/unsub`, encryptedRequest({
      artistIds: Array.isArray(ids) ? ids : [ids]
    }))
  )
}

export async function favoriteArtists () {
  const uid = getUserId()
  return await(needLogin() || request
    .post(`/weapi/artist/sublist`, encryptedRequest({ id: uid, uid }))
  )
}

export async function getAlbumsByArtistId (artistId: string, limit = '30', offset = '0') {
  return await request
    .get(`/api/artist/albums/${artistId}?offset=${offset}&limit=${limit}`)
}

export async function artistDescription (id: string) {
  return await request
    .post(`/weapi/artist/introduction`, encryptedRequest({
      id
    }))
}

export interface IComments {
  comments: IComemnt[],
  hotComments: IComemnt[],
  code: number,
  more: boolean,
  offset: number,
  userId: number,
  total: number
}

export interface IComemnt {
  beReplied: IComemnt[],
  commentId: number,
  content: string,
  liked: boolean,
  likedCount: number,
  time: number,
  user: IUser,
  id: number
}

export async function getComments (
  commentId: string,
  limit = '100',
  offset = '0',
  total = 'true'
) {
  return await request
    .post(`/weapi/v1/resource/comments/${commentId}`, encryptedRequest({
      rid: commentId,
      offset,
      limit,
      total
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
