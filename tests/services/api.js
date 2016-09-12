import {
  login,
  getUserID,
  userPlayList,
  playListDetail,
  personalFM,
  search,
  SearchType,
  getCookie
} from '../../lib/services/api.js'

import crypto from 'crypto'
import test from 'ava'

const Pagination = {
  offset: 0,
  limit: 10
}

test.only('should login algorithm works', async (t) => {
  const fuck = await login('18502080838', 'if(country)noEsc')
  console.log(fuck)
  console.log(getCookie())
  t.is(fuck.body.code, 200)
})

// test('getUserID return null', (t) => {
//   t.is(getUserID(), null)
// })
//
// test('setCookie can change header', (t) => {
//   const randomArr = crypto.randomBytes(20).toString('hex').split('')
//   const request = setCookie(randomArr)
//   t.deepEqual(request.defaults.headers.common['Cookie'], randomArr.join(''))
// })
//
// test('email login works', async (t) => {
//   const { config } = await login('苟', '岂')
//   t.is(config.url, 'http://music.163.com/weapi/login/')
// })
//
// test('can access user play list', async (t) => {
//   const { data } = await userPlayList({
//     ...Pagination,
//     uid: '123242395'
//   })
//   t.is(data.code, 200)
// })
//
// test('can access play list details', async (t) => {
//   const { data } = await playListDetail('370310078')
//   t.is(data.code, 200)
// })
//
// test('search for songs', async (t) => {
//   const { data } = await search({
//     ...Pagination,
//     s: '香',
//     type: SearchType.song,
//     total: true
//   })
//   t.is(data.code, 200)
// })
//
// test('search for singers', async (t) => {
//   const { data } = await search({
//     ...Pagination,
//     s: '港',
//     type: SearchType.singer,
//     total: true
//   })
//   t.is(data.code, 200)
// })
//
// test('search for albums', async (t) => {
//   const { data } = await search({
//     ...Pagination,
//     s: '记',
//     type: SearchType.album,
//     total: true
//   })
//   t.is(data.code, 200)
// })
//
// test('search for song lists', async (t) => {
//   const { data } = await search({
//     ...Pagination,
//     s: '者',
//     type: SearchType.songList,
//     total: true
//   })
//   t.is(data.code, 200)
// })
//
// test('search for users', async (t) => {
//   const { data } = await search({
//     ...Pagination,
//     s: '快',
//     type: SearchType.user,
//     total: true
//   })
//   t.is(data.code, 200)
// })
//
// test('can access personal FM', async (t) => {
//   const { data } = await personalFM()
//   t.is(data.code, 200)
// })
//
// test.before('can not access recommend play lists', async (t) => {
//   const res = await recommnedPlayList({
//     ...Pagination,
//     total: true
//   })
//   t.falsy(res)
// })
//
// test.after('can access recommend play lists', async (t) => {
//   const res = await recommnedPlayList({
//     ...Pagination,
//     total: true
//   })
//   console.log(res)
//   t.pass()
// })

// test('can access user profile', async (t) => {
//   const fuck = await userProfile()
//   console.log(getUserID())
//   t.pass()
// })
