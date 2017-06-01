import * as tough from 'tough-cookie-no-native'
import * as qs from 'qs'

declare const process: any
export const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://music.163.com'
  : 'http://music.163.com'

const cookieJar = new tough.CookieJar()

const defaultHeaders = {
  'Accept': '*/*',
  'Accept-Encoding': 'gzip,deflate,sdch',
  'Accept-Language': 'zh-CN,en-US;q=0.7,en;q=0.3',
  'Connection': 'keep-alive',
  'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
  'Host': 'music.163.com',
  'Referer': API_BASE_URL,
  'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:39.0) Gecko/20100101 Firefox/39.0'
}

export function getCookies () {
  return cookieJar.getCookieStringSync(API_BASE_URL)
}

export function setCookies (cookie: string): void {
  if (typeof cookie === 'string')  {
    if (cookie.includes(';')) {
      cookie.split(';').forEach((c) => {
        cookieJar.setCookieSync(c, API_BASE_URL)
      })
    } else {
      cookieJar.setCookieSync(cookie, API_BASE_URL)
    }
  }
}

export function getCsrfFromCookies (): string | null {
  const csrfReg = /csrf=(\w*)/.exec(getCookies())
  return csrfReg ? csrfReg[1] : null
}

function checkStatusFilter (response: any) {
  if (response.ok) {
    return response
  } else {
    const error = new Error(response.statusText)
    error.name = 'http'
    return {
      error
    }
  }
}

function parseJSONFilter (response) {
  return response.json()
}

function addUserIdToCookies (response) {
  if (response && response.profile && response.profile.userId) {
    setCookies(`uid=${response.profile.userId}`)
  }
  return response
}

function setCookiesFilter (response) {
  const cookies = response.headers.getAll('set-cookie')
  // console.log(cookies)
  if (Array.isArray(cookies) && cookies.length) {
    setCookies(
      cookies.join(';')
        .split(';')
        .map((c) => c.trim())
        .filter((c) => c.includes('='))
        .join(';')
    )
  }
  return response
}

function get (
  uri: string
): Promise<any> {
  return fetch(API_BASE_URL + uri, {
    headers: Object.assign({}, defaultHeaders, {
      'Cookie': getCookies()
    })
  })
  .then(checkStatusFilter)
  .then(setCookiesFilter)
  .then(parseJSONFilter)
  .catch((error) => ({error}))
}

function post (
  uri: string,
  body: {}
): Promise<any>  {
  return fetch(API_BASE_URL + uri, {
    body: qs.stringify(body),
    headers: Object.assign({}, defaultHeaders, {
      'Cookie': getCookies()
    }),
    method: 'POST'
  })
  .then(checkStatusFilter)
  .then(setCookiesFilter)
  .then(parseJSONFilter)
  .then(addUserIdToCookies)
  .catch((error) => ({error}))
}

export const request = {
  get,
  post
}
