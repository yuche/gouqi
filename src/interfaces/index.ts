export interface IUserInfo {
  username: string,
  password: string
}

/**
 * Flux Standard Action created by redux-actions
 * https://github.com/acdlite/flux-standard-action
 */
export interface IFSA<T> {
  type: string,
  payload: T,
  error?: boolean
}
