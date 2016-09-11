import crypto from './crypto'
import axios from 'axios'
import { stringify } from 'querystring'

const request: Axios.AxiosInstance = axios.create({
  baseURL: 'http://music.163.com',
  headers: {
    'Accept': '*/*',
    'Accept-Encoding': 'gzip,deflate,sdch',
    'Accept-Language': 'zh-CN,en-US;q=0.7,en;q=0.3',
    'Connection': 'keep-alive',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'Host': 'music.163.com',
    'Referer': 'http://music.163.com/',
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:39.0) Gecko/20100101 Firefox/39.0'
  }
})

export function setCookie (cookie: string[]): Axios.AxiosInstance {
  // tslint:disable-next-line
  request.defaults.headers.common['Cookie'] = cookie
  return request
}

export function getUserID () {
  // tslint:disable-next-line
  const cookie = request.defaults.headers.common['Cookie']
  if (!cookie) {
    return null
  }
  return /\d+/.exec(cookie[3])[0]
}

interface ILoginBody {
  password: string,
  rememberLogin: string,
  phone?: string,
  username?: string
}

export async function login (username: string, password: string): Promise<Axios.AxiosXHR<{}>> {
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
  const encBody = crypto.aesRsaEncrypt(JSON.stringify(body))
  return await request.post(url, stringify(encBody))
}

export async function userProfile (userId = getUserID()): Promise<Axios.AxiosXHR<{}>> {
  return await request.get('/api/user/detail/' + userId, stringify({ userId }))
}

interface IPaginationBody {
  offset: number,
  limit: number
}

interface IPlayListBody extends IPaginationBody {
  uid: string
}

export async function userPlayList (body: IPlayListBody): Promise<Axios.AxiosXHR<{}>> {
  return await request.post('/api/user/playlist/', stringify(body))
}

export async function playListDetail (id: string): Promise<Axios.AxiosXHR<{}>> {
  return await request.get('/api/playlist/detail', stringify({ id }))
}

const enum SearchType {
  song = 1,
  singer = 100,
  album = 10,
  songList = 1000,
  user = 1002
}

interface ISearchBody extends IPaginationBody {
  s: string,
  type: SearchType,
  total: string
}

export async function search (body: ISearchBody): Promise<Axios.AxiosXHR<{}>> {
  return await request.post('/api/search/get/web', stringify(body))
}

