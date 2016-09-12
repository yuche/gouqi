import crypto from './crypto'
import { stringify } from 'querystring'
import Cookie from 'cookie';
import rq from 'request-promise'
export const API_BASE_URL = 'http://music.163.com'

const request = rq.defaults({
  baseUrl: API_BASE_URL,
  gzip: true,
  headers: {
    'Accept': '*/*',
    'Accept-Encoding': 'gzip,deflate,sdch',
    'Accept-Language': 'zh-CN,en-US;q=0.7,en;q=0.3',
    'Connection': 'keep-alive',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'Host': 'music.163.com',
    'Referer': 'http://music.163.com/',
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:39.0) Gecko/20100101 Firefox/39.0'
  },
  jar: true,
  proxy: 'http://localhost:8888',
  useQuerystring: true
})

export function getCookie () {
  return request.jar().getCookieString(API_BASE_URL)
}

export function setCookie (cookies: string[]): void {
  request.jar().setCookie(request.cookie(
    stringify(
      Cookie.parse(cookies.join(''))
    )
  ), API_BASE_URL)
}

export function getUserID (): Object[] {
  const jar = request.jar()
  const cookie = jar.getCookies(API_BASE_URL)
  return cookie
}

interface ILoginBody {
  password: string,
  rememberLogin: string,
  phone?: string,
  username?: string
}


export async function login (username: string, password: string) {
  const patten = /^0\d{2,3}\d{7,8}$|^1[34578]\d{9}$/
  let url = '/weapi/login/'
  let body: ILoginBody = {
    password: crypto.MD5(password),
    rememberLogin: 'true'
  }
  if (patten.test(username)) {
    body.phone = username
    url = '/weapi/login/cellphone/'
  } else {
    body.username = username
  }
  const encBody = crypto.encryptedRequest(body)
  return await request.post(url, {
    body: stringify(encBody),
    resolveWithFullResponse: true
  })
}

// use userPlayList() to get userProfile for now
// export async function userProfile (userId = getUserID()): Promise<Axios.AxiosXHR<{}>> {
//   if (!userId) {
//     return null
//   }
//   return await request.get('/api/user/detail/' + userId, {
//     params: {
//       userId
//     }
//   })
// }

export interface IPaginationParams {
  offset: number,
  limit: number,
  total?: boolean | string
}

export interface IPlayListParams extends IPaginationParams {
  uid: string
}

export async function userPlayList (qs: IPlayListParams) {
  return await request.get('/api/user/playlist/', { qs })
}

export async function playListDetail (id: string) {
  return await request.get('/api/playlist/detail', {
    qs: { id }
  })
}

export const enum SearchType {
  song = 1,
  singer = 100,
  album = 10,
  songList = 1000,
  user = 1002
}

export interface ISearchBody extends IPaginationParams {
  s: string,
  type: SearchType | string
}

export async function search (body: ISearchBody) {
  return await request.post('/api/search/get/web', { body: stringify(body) })
}

export async function personalFM () {
  return await request.get('/api/radio/get')
}

// export async function recommnedPlayList (body: IPaginationParams) {
//   if (!getCookie()) {
//     return null
//   }
//   const csrf = getCookie()[0]['HttpOnly__csrf']
//   return await request
//     .post('/weapi/v1/discovery/recommend/songs?csrf_token=' + csrf,
//       stringify( crypto.encryptedRequest(
//         Object.assign({}, body, { 'csrf_token': csrf })
//       ) )
//     )
// }
