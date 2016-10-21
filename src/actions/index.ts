import { createAction, Action } from 'redux-actions'
import {
  IToastPayload,
  IUserInfo
} from '../interfaces'

export type IuserLogin = (userInfo: IUserInfo) => Action<IUserInfo>
export const userLogin: IuserLogin = createAction('user/login')

export const syncPlaylists = createAction('playlists/sync')

export type ItoastAction = (payload: IToastPayload) => Action<IToastPayload>

export const toastAction: ItoastAction = createAction('ui/toast')

