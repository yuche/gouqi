import {
  login,
  setCookie
} from '../../lib/services/api.js'

import test from 'ava'
import {
  sample
} from 'lodash'

test('setCookie can change header', (t) => {
  const randObj = sample(test)
  const request = setCookie(randObj)
  t.deepEqual(request.defaults.headers.common['Cookie'], randObj)
})
