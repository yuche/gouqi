const Cookie = require('cookie')
const setCookie = [ '__remember_me=true; Expires=Tue, 27 Sep 2016 11:55:08 GMT; Path=/; HttpOnly',
     'MUSIC_U=71d9d005e338c76c6a28b67871c0204ee37d58e52c3b223ae80241b0dcde55d5d3f42e78f3ffeaa37ec515d9a2fef1d941049cea1c6bb9b6; Expires=Tue, 27 Sep 2016 11:55:08 GMT; Path=/; HttpOnly',
     '__csrf=22c5298c16953f72208e40003aaa6d4a; Expires=Tue, 27-Sep-2016 11:55:18 GMT; Path=/',
     'NETEASE_WDA_UID=330898395#|#1473532860170; Expires=Sat, 30 Sep 2084 15:09:15 GMT; Path=/; HttpOnly' ]
const { stringify } = require('querystring')
// const cookies = setCookie.map(Cookie.parse)
console.log(stringify(Cookie.parse(setCookie.join(''))))
