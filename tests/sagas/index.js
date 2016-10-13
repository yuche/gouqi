import { loginFlow } from '../../lib/sagas'
import { take, put, call } from 'redux-saga/effects'
import * as api from '../../lib/services/api'
import {
  userLogin
} from '../../lib/actions'
import test from 'ava'

test('should login flow works', async (t) => {
  let gen = loginFlow()

  t.deepEqual(
    gen.next().value,
    take('user/login'),
    'take the login action'
  )

  const loginStart = {
    type: 'user/login/start'
  }

  t.deepEqual(
    gen.next(userLogin({
      username: '18077162384',
      password: 'runFast'
    })).value,
    put(loginStart),
    'start the login'
  )

  t.deepEqual(
    gen.next(true).value,
    call(api.login, '18077162384', 'runFast'),
    'start the login'
  )

  t.deepEqual(
    gen.next({
      code: 200
    }).value,
    put({
      type: 'user/login/end'
    }),
    'put login end'
  )
})


