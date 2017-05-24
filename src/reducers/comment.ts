import { handleActions } from 'redux-actions'
import { IComments } from '../services/api'

export interface ICommentState {
  comments: ICommentObj,
  isLoading: false,
  isLoadingMore: false
}

export interface ICommentObj {
  [props: string]: IComments
}

export const initialState = {
  comments: {},
  isLoading: false,
  isLoadingMore: false
}

export default handleActions({
  'comments/sync/start' (state) {
    return {
      ...state,
      isLoading: true
    }
  },
  'comments/more/start' (state) {
    return {
      ...state,
      isLoadingMore: true
    }
  },
  'comments/sync/end' (state) {
    return {
      ...state,
      isLoading: false
    }
  },
  'comments/more/end' (state) {
    return {
      ...state,
      isLoadingMore: false
    }
  },
  'comments/sync/save' (state, { payload }) {
    return {
      ...state,
      comments: {
        ...state.comments,
        ...payload
      }
    }
  }
}, initialState)
