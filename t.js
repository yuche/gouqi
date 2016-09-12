const qs = require('querystring')
console.log(qs.parse('__remember_me=true; MUSIC_U=71d9d005e338c76c6a28b67871c0204e078f273a3d183c29b45861731789d7c68041b38ce7f22b551beea50691641da27955a739ab43dce1; __csrf=e78dfc9f669bfe18310ccfe63c5aa287; NETEASE_WDA_UID=330898395#|#1473532860170'
.split(';').find(c => c.includes('UID')
)
))
