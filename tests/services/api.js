import * as api from '../../lib/services/api.js'
import * as CookieJar from '../../lib/services/request.js'

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
  type
) {
  const channels = await api.djChannels(type)
  t.true(channels.every(c => isNumeric(c)))
}

test.before('batch song details new api return null', async (t) => {
  const body = await api.batchSongDetailsNew(['123456', '123454'])
  t.falsy(body)
})

test.before('can not access recommend play lists', async (t) => {
  const body = await api.recommendPlayList({
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
      cookieStr.split(';').forEach(CookieJar.setCookies)
    } else {
      await api.login('18502080838', 'if(country)noEsc')
      fs.writeFileSync(cookiePath, CookieJar.getCookies())
    }
  } else {
    await api.login('18502080838', 'if(country)noEsc')
    fs.writeFileSync(cookiePath, CookieJar.getCookies())
  }
  t.pass()
})

test('email login works', macroReturnCode, api.login, 502, '华莱士', 'verytall')

test('cellphone login works', macroReturnCode, api.login, 502, sample(testAccounts), 'exciting')

test('can access user play list', macroReturnCode, api.userPlayList, 200, '123242395')

test('can access play list details', macroReturnCode, api.playListDetail, 200, '370310078')

test('search for songs', macroReturnCode, api.search, 200, '香', api.SearchType.song)

test('search for singers', macroReturnCode, api.search, 200, '港', api.SearchType.singer)

test('search for albums', macroReturnCode, api.search, 200, '记', api.SearchType.album)

test('search for songList', macroReturnCode, api.search, 200, '者', api.SearchType.songList)

test('search for users', macroReturnCode, api.search, 200, '快', api.SearchType.user)

test('can access personal FM', macroReturnCode, api.personalFM)

test.after('can access recommend play lists', macroReturnCode, api.recommendPlayList)

test('fm like', macroReturnCode, api.fmLike, 200, '123456')

test('fm Trash', macroReturnCode, api.fmTrash, 200, '123456')

test('new albums', macroReturnCode, api.newAlbums)

test.only('top play list', macroReturnCode, api.topPlayList)

test('top artist', macroReturnCode, api.topArtists)

test('artist info', macroReturnCode, api.artistInfo, 200, '9621')

test('album info', macroReturnCode, api.albumInfo, 200, '34751985')

test('dj channels today hotest', macroDjChannelType, api.ChannelsType.today)

test('dj channels week hotest', macroDjChannelType, api.ChannelsType.week)

test('dj channels history hotest', macroDjChannelType, api.ChannelsType.history)

test('dj channels recent hotest', macroDjChannelType, api.ChannelsType.recent)

test('dj channels details', macroReturnCode, api.channelDetails, 200, '793766444')

test('single song details', macroReturnCode, api.singleSongDetails, 200, '29713754')

test('batch song details', async (t) => {
  const { code } = await api.batchSongDetails([
    '29713754',
    '299604'
  ])
  t.is(code, 200)
})

test.after('batch song details new api', async (t) => {
  const { code } = await api.batchSongDetailsNew([
    '29713754',
    '299604'
  ])
  t.is(code, 200)
})

test('add a song to playlist', async (t) => {
  const { code } = await api.opMuiscToPlaylist('29713754', '462066110', 'add')
  t.true(code === 200 || code === 502)
})

test('set music farvorite', macroReturnCode, api.setMusicFavorite, 200, '29713754', true)

test('set music unfarvorite', macroReturnCode, api.setMusicFavorite, 200, '29713754', false)

test('create play list', macroReturnCode, api.createPlaylist, 200, '大新闻')

// test('update play list', macroReturnCode, api.updatePlaylist, 200, '469543495', 'fuckyou')

// test('delete play list', macroReturnCode, api.deletePlaylist, 200, '469524737')

// test('subscribe play list', macroReturnCode, api.subscribePlaylist, 200, '460655470')
