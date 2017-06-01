import * as api from '../api'
import * as fetch from 'node-fetch'

declare const global: any

const response = {
  ok: false,
  status: 404,
  statusText: 'Not Found'
}

global.fetch = () => Promise.resolve(response)

it('should return a object that includes error', async () => {
  const res = await Promise.all([
    api.login('wallace', 'verytall'),
    api.newAlbums('30', '0'),
    api.topArtists('30', '0')
  ])
  function isError ({ error }) {
    return error instanceof Error
  }
  expect(res.every(isError)).toBeTruthy()
})

afterAll(() => {
  global.fetch = fetch
})
