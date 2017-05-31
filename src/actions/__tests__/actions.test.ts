import {
  startSearch,
  changeSearchActiveTab,
  syncAlbumDetail,
  removeDownloadingItem,
  syncPlaylistDetail,
  syncArtistTracks,
  syncArtistAlbums,
  syncArtistDescription,
  subscribePlaylist,
  getComments,
  getMoreComments,
  followArtist
} from '../index'

test('startSearch', () => {
  expect(
    startSearch('query')
  ).toEqual({
    type: 'search/query',
    payload: {
      query: 'query'
    }
  })
})

test('changeSearchActiveTab', () => {
  expect(
    changeSearchActiveTab(110)
  ).toEqual({
    type: 'search/activeTab',
    payload: 110
  })
})

test('syncAlbumDetail', () => {
  expect(
    syncAlbumDetail(110)
  ).toEqual({
    type: 'albums/detail',
    payload: 110
  })
})

test('syncPlaylistDetail', () => {
  expect(
    syncPlaylistDetail(110)
  ).toEqual({
    type: 'details/playlist',
    payload: 110
  })
})

test('removeDownloadingItem', () => {
  expect(
    removeDownloadingItem(110)
  ).toEqual({
    type: 'download/downloading/remove',
    payload: 110
  })
})
test('syncArtistTracks', () => {
  expect(
    syncArtistTracks(110)
  ).toEqual({
    type: 'artists/detail/track',
    payload: 110
  })
})
test('syncArtistAlbums', () => {
  expect(
    syncArtistAlbums(110)
  ).toEqual({
    type: 'artists/detail/album',
    payload: 110
  })
})
test('syncArtistDescription', () => {
  expect(
    syncArtistDescription(110)
  ).toEqual({
    type: 'artists/detail/description',
    payload: 110
  })
})
test('followArtist', () => {
  expect(
    followArtist(110)
  ).toEqual({
    type: 'artists/detail/follow',
    payload: 110
  })
})
test('subscribePlaylist', () => {
  expect(
    subscribePlaylist(110)
  ).toEqual({
    type: 'details/playlist/subscribe',
    payload: 110
  })
})
test('getComments', () => {
  expect(
    getComments(110)
  ).toEqual({
    type: 'comments/sync',
    payload: 110
  })
})
test('getMoreComments', () => {
  expect(
    getMoreComments(110)
  ).toEqual({
    type: 'comments/more',
    payload: 110
  })
})
