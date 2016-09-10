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

export function setCookie(cookie: string[]): Axios.AxiosInstance {
  // tslint:disable-next-line
  request.defaults.headers.common['Cookie'] = cookie
  return request
}

interface IloginBody {
  password: string,
  rememberLogin: string,
  phone?: string,
  username?: string
}

export async function login (username: string, password: string): Promise<Axios.AxiosXHR<{}>> {
  const patten = /^0\d{2,3}\d{7,8}$|^1[34578]\d{9}$/
  let url = '/weapi/login/'
  let body: IloginBody = {
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
console.log(request)