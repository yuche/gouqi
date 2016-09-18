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
const { sample } = require('lodash')
const fs = require('fs')
const path = require('path')

const Pagination = {
  offset: 0,
  limit: 10
}

const testAccounts = [
  '18077162384',
  '18502080838',
  '15078171902'
]

async function macroReturnCode (
  t,
  asyncFunction,
  expectedCode = 200,
  ...args
) {
  const { code } = await asyncFunction(...args)
  t.is(code, expectedCode)
}

function isNumeric (value) {
    return /^\d+$/.test(value)
}

async function macroDjChannelType (
  t,
  stype
) {
  const channels = await djChannels(stype)
  t.true(channels.every(c => isNumeric(c)))
}

async function macroSearch (s, type) {
  const { code } = await search({
    ...Pagination,
    s,
    type,
    total: true
  })
  t.is(code, 200)
}

test.before('batch song details new api return null', async (t) => {
  const body = await batchSongDetailsNew(['123456', '123454'])
  t.falsy(body)
})

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

test('email login works', macroReturnCode, login, 502, '华莱士', 'verytall')

test('cellphone login works', macroReturnCode, login, 502, sample(testAccounts), 'exciting')

test('can access user play list', macroReturnCode, userPlayList, 200, {
  ...Pagination,
  uid: '123242395
})

test('can access play list details', macroReturnCode, playListDetail, 200, '370310078')

test('search for songs', macroSearch, '香', SearchType.song)

test('search for singers', macroSearch, '港', SearchType.singer)

test('search for albums', macroSearch, '记', SearchType.album)

test('search for songList', macroSearch, '者', SearchType.songList)

test('search for users', macroSearch, '快', SearchType.user)

test('can access personal FM', macroReturnCode, personalFM)

test.after('can access recommend play lists', macroReturnCode, recommnedPlayList, 200, {
  ...Pagination,
  total: true
})

test('fm like', macroReturnCode, fmLike, 200, '123456')

test('fm Trash', macroReturnCode, fmTrash, 200, '123456')

test('new albums', macroReturnCode, newAlbums)

test('top play list', macroReturnCode, topPlayList)

test('top artist', macroReturnCode, topArtists)

test('artist info', macroReturnCode, artistInfo, 200, '9621')

test('album info', macroReturnCode, albumInfo, 200, '34751985')

test('dj channels today hotest', macroDjChannelType, ChannelsType.today)

test('dj channels week hotest', macroDjChannelType, ChannelsType.week)

test('dj channels history hotest', macroDjChannelType, ChannelsType.history)

test('dj channels recent hotest', macroDjChannelType, ChannelsType.recent)

test('dj channels details', channelDetails, 200, '793766444')

test('single song details', singleSongDetails, 200, '29713754')

test('batch song details', async (t) => {
  const { code } = await batchSongDetails([
    '29713754',
    '299604'
  ])
  t.is(code, 200)
})

test.after('batch song details new api', async (t) => {
  const { code } = await batchSongDetailsNew([
    '29713754',
    '299604'
  ])
  t.is(code, 200)
})

