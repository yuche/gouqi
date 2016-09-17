import {
  login,
  userPlayList,
  playListDetail,
  personalFM,
  search,
  setCookies,
  SearchType,
  getCookies,
  recommnedPlayList,
  fmLike,
  fmTrash,
  newAlbums,
  topPlayList,
  topArtists,
  artistInfo,
  albumInfo,
  djChannels,
  channelDetails,
  singleSongDetails,
  batchSongDetails,
  batchSongDetailsNew,
  ChannelsType
} from '../../lib/services/api.js'

import test from 'ava'
const fs = require('fs')
const path = require('path')

const Pagination = {
  offset: 0,
  limit: 10
}

async function macroReturnCode (
  t,
  asyncFunction,
  expectedCode = 200,
  ...args
) {
  const { code } = await asyncFunction(...args)
  t.is(code, expectedCode)
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

test('fm like', async (t) => {
  const { code } = await fmLike('123456')
  t.is(code, 200)
})

test('fm trash', async (t) => {
  const { code } = await fmTrash('123456')
  t.is(code, 200)
})

test('new albums', macroReturnCode, newAlbums)

test('top play list', macroReturnCode, topPlayList)

test('top artist', macroReturnCode, topArtists)

test('artist info', macroReturnCode, artistInfo, 200, '123456')

test('album info', macroReturnCode, albumInfo, 200, '123456')

test('dj channels today hotest',
  macroReturnCode, djChannels, ChannelsType.today)

test('dj channels week hotest',
  macroReturnCode, djChannels, ChannelsType.week)

test('dj channels history hotest',
  macroReturnCode, djChannels, ChannelsType.history)

test('dj channels recent hotest',
  macroReturnCode, djChannels, ChannelsType.recent)

test('dj channels details', channelDetails, 200, '123567')

test('single song details', singleSongDetails, 200, '123456')

test('batch song details', batchSongDetails, 200, [
  '123456',
  '654321'
])

test.after('batch song details new api', batchSongDetailsNew, 200, {
  songIds: [
    '123456',
    '654321'
  ]
})

