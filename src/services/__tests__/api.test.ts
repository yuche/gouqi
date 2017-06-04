/**
 * API 测试我们这里请求了真实的网易云音乐服务器，而没有使用 mock。
 * 因为对于这个项目来说网易的数据返回情况是不可控的，
 * 我们必须保证数据正确 App 才能跑起来。
 */

import * as api from '../api'
import { setCookies, getCookies } from '../request'
import * as fetch from 'node-fetch'

declare const global: any
declare const __dirname: boolean

jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000

// tslint:disable-next-line:no-var-requires
const fs = require('fs')
// tslint:disable-next-line:no-var-requires
const path = require('path')

function apiTest (name: string, asyncFn, ...args) {
  return it(name, async () => {
    const response = await asyncFn(...args)
    // console.log(response)
    expect(response.code).toBe(200)
  })
}

global.fetch = fetch

it('need login api should return unlogin error', async () => {
  const needLoginApis = [
    api.userPlayList('123', '456', '15', true),
    api.dailyRecommend('50', '30', 'true'),
    api.opMuiscToPlaylist('29713754', '462066110', 'add'),
    api.setMusicFavorite('29713754', true),
    api.deletePlaylist('469524737'),
    api.subscribePlaylist('29713754', true),
    api.subscribeArtist('9621'),
    api.unsubscribeArtist('9621'),
    api.favoriteArtists(),
    api.batchSongDetailsNew(['29713754'], '320000')
  ]
  const response = await Promise.all(needLoginApis)
  expect(response).toEqual(response.map(() => ({ error: new Error('未登录') })))
})

apiTest('login succeed', api.login, '18502080838', 'if(country)noEsc')

apiTest('userPlayList', api.userPlayList)

apiTest('search succeed', api.search, 'wallace', api.SearchType.artist, '30', '0', 'true')

apiTest('search default values', api.search, 'wallace', api.SearchType.artist)

apiTest('playListDetail', api.playListDetail, '469524737')

apiTest('dailyRecommend', api.dailyRecommend)

apiTest('personalFM', api.personalFM)

apiTest('fmLike', api.fmLike, '123456')

apiTest('fm unLike', api.fmLike, '123456', false, '25', 'itembased')

apiTest('fmTrash', api.fmTrash, '123456')

apiTest('fmTrash', api.fmTrash, '123456', '25', 'RT')

apiTest('newAlbums', api.newAlbums)

apiTest('topPlayList default props', api.topPlayList)

apiTest('topPlayList', api.topPlayList, '10', '0', '全部', 'hot', true)

apiTest('topArtists', api.topArtists)

apiTest('artistInfo', api.artistInfo, '9621')

apiTest('albumInfo', api.albumInfo, '3064113')

apiTest('subscribePlaylist', api.subscribePlaylist, '739396417')

apiTest('unsubscribePlaylist', api.subscribePlaylist, '739396417', false)

apiTest('albumDetail', api.albumDetail, '3064113')

apiTest('channelDetails', api.channelDetails, '793766444')

apiTest('singleSongDetails', api.singleSongDetails, '29713754')

apiTest('batchSongDetails', api.batchSongDetails, ['29713754'])

apiTest('getLyric', api.getLyric, '29713754')

apiTest('batchSongDetailsNew', api.batchSongDetailsNew, ['29713754'])

apiTest('add MuiscToPlaylist', api.opMuiscToPlaylist, ['29713754'], '485021422', 'add')

apiTest('del MuiscToPlaylist', api.opMuiscToPlaylist, ['29713754'], '485021422', 'del')

it('create and delete playlist', async () => {
    const { id } = await api.createPlaylist('大新闻')
    await api.deletePlaylist(id.toString())
  })

apiTest('favoriteArtists', api.favoriteArtists)

apiTest('subscribeArtist', api.subscribeArtist, '9621')

apiTest('unsubscribeArtist', api.unsubscribeArtist, '9621')

apiTest('getAlbumsByArtistId default values', api.getAlbumsByArtistId, '9621')

apiTest('getAlbumsByArtistId', api.getAlbumsByArtistId, '9621', '30', '0')

apiTest('artistDescription', api.artistDescription, '9621')

apiTest('getComments', api.getComments, 'A_PL_0_747066374')

apiTest('getComments', api.getComments, 'A_PL_0_747066374', '100', '0', 'true')
