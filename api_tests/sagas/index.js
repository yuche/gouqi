import { loginFlow } from '../../lib/sagas'
import { take, put, call } from 'redux-saga/effects'
import * as api from '../../lib/services/api'
import {
  userLogin
} from '../../lib/actions'
import test from 'ava'

test('should login flow works', async (t) => {
  let gen = loginFlow()

  t.pass()
})
