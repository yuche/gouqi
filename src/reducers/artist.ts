import { handleActions } from 'redux-actions'
import * as api from '../services/api'

const initialState = {
  artists: [],
  more: true,
  isLoading: false,
  isRefreshing: false,
  offset: 0,
  isLoadingAlbums: false,
  isLoadingTracks: false,
  isLoadingDescription: false,
  isSubscribing: false,
  detail: {}
}

export interface IArtists {
  [props: number]: {
    artist: api.IArtist
    tracks: api.ITrack[]
    description: any,
    albums: api.IAlbum[]
  }
}

export default handleActions({
  'artists/refresh/start' (state) {
    return {
      ...state,
      isRefreshing: true
    }
  },
  'artists/refresh/end' (state) {
    return {
      ...state,
      isRefreshing: false
    }
  },
  'artists/sync/start' (state) {
    return {
      ...state,
      isLoading: true
    }
  },
  'artists/detail/album/save' (state, { payload, meta }: any) {
    return {
      ...state,
      detail: {
        ...state.detail,
        [meta]: {
          ...state.detail[meta],
          albums: payload
        }
      }
    }
  },
  'artists/detail/album/start' (state) {
    return {
      ...state,
      isLoadingAlbums: true
    }
  },
  'artists/detail/album/end' (state) {
    return {
      ...state,
      isLoadingAlbums: false
    }
  },
  'artists/detail/track/save' (state, { payload, meta }: any) {
    return {
      ...state,
      detail: {
        ...state.detail,
        [meta]: {
          ...state.detail[meta],
          tracks: payload.tracks,
          artist: payload.artist
        }
      }
    }
  },
  'artists/detail/follow/toggle' (state, { payload, meta }: any) {
    const detail = state.detail[meta]
    return {
      ...state,
      detail: {
        ...state.detail,
        [meta]: {
          ...state.detail[meta],
          artist: {
            ...detail.artist,
            followed: payload
          }
        }
      }
    }
  },
  'artists/detail/track/start' (state) {
    return {
      ...state,
      isLoadingTracks: true
    }
  },
  'artists/detail/track/end' (state) {
    return {
      ...state,
      isLoadingTracks: false
    }
  },
  'artists/detail/follow/start' (state) {
    return {
      ...state,
      isSubscribing: true
    }
  },
  'artists/detail/follow/end' (state) {
    return {
      ...state,
      isSubscribing: false
    }
  },
  'artists/detail/description/save' (state, { payload, meta }: any) {
    return {
      ...state,
      detail: {
        ...state.detail,
        [meta]: {
          ...state.detail[meta],
          description: payload
        }
      }
    }
  },
  'artists/detail/description/start' (state) {
    return {
      ...state,
      isLoadingDescription: true
    }
  },
  'artists/detail/description/end' (state) {
    return {
      ...state,
      isLoadingDescription: false
    }
  },
  'artists/sync/end' (state) {
    return {
      ...state,
      isLoading: false
    }
  },
  'artists/sync/save' (state, { payload, meta = { more: true, offset: 0 } }: any) {
    return {
      ...state,
      artists: payload,
      more: meta.more,
      offset: meta.offset
    }
  }
}, initialState)
