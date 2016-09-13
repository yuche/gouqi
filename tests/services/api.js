import {
  login,
  getUserID,
  userPlayList,
  playListDetail,
  personalFM,
  search,
  setCookies,
  SearchType,
  getCookies,
  recommnedPlayList
} from '../../lib/services/api.js'

import crypto from 'crypto'
import test from 'ava'
import {
  Random
} from 'mockjs'
const fs = require('fs')
const path = require('path')

const Pagination = {
  offset: 0,
  limit: 10
}

test.before('can not access recommend play lists', async (t) => {
  const body = await recommnedPlayList({
    ...Pagination,
    total: true
  })
  t.falsy(body)
})

test.before('set cookies', async (t) => {
  const cookiePath = path.resolve('../../lib/cookies.txt')
  if (fs.existsSync(cookiePath)) {
    const { mtime } = fs.statSync(cookiePath)
    let tenDaysAgo = new Date()
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 10)
    if (mtime > tenDaysAgo) {
      const cookieStr = fs.readFileSync(cookiePath, 'UTF-8')
      cookieStr.split(';').forEach(setCookies)
    } else {
      await login('18502080838', 'if(country)noEsc')
      fs.writeFileSync(cookiePath, getCookies())
    }
  } else {
    await login('18502080838', 'if(country)noEsc')
    fs.writeFileSync(cookiePath, getCookies())
  }
  t.pass()
})

test('email login works', async (t) => {
  const { code } = await login('18502080838', 'tooyoung')
  t.is(code, 502) // 502 = wrong password
})

test('cellphone login works', async (t) => {
  const { code } = await login('18502080838', 'exciting')
  t.is(code, 502)
})

test('can access user play list', async (t) => {
  const { code } = await userPlayList({
    ...Pagination,
    uid: '123242395'
  })
  t.is(code, 200)
})

test('can access play list details', async (t) => {
  const { code } = await playListDetail('370310078')
  t.is(code, 200)
})

test('search for songs', async (t) => {
  const { code } = await search({
    ...Pagination,
    s: '香',
    type: SearchType.song,
    total: true
  })
  t.is(code, 200)
})

test('search for singers', async (t) => {
  const { code } = await search({
    ...Pagination,
    s: '港',
    type: SearchType.singer,
    total: true
  })
  t.is(code, 200)
})

test('search for albums', async (t) => {
  const { code } = await search({
    ...Pagination,
    s: '记',
    type: SearchType.album,
    total: true
  })
  t.is(code, 200)
})

test('search for song lists', async (t) => {
  const { code } = await search({
    ...Pagination,
    s: '者',
    type: SearchType.songList,
    total: true
  })
  t.is(code, 200)
})

test('search for users', async (t) => {
  const { code } = await search({
    ...Pagination,
    s: '快',
    type: SearchType.user,
    total: true
  })
  t.is(code, 200)
})

test('can access personal FM', async (t) => {
  const { code } = await personalFM()
  t.is(code, 200)
})

test.after('can access recommend play lists', async (t) => {
  const { code } = await recommnedPlayList({
    ...Pagination,
    total: true
  })
  t.is(code, 200)
})

// test('can access user profile', async (t) => {
//   const fuck = await userProfile()
//   console.log(getUserID())
//   t.pass()
// })
