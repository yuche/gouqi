import {
  playCount,
  parseLyrics,
  changeCoverImgUrl,
  PLACEHOLDER_IMAGE,
  getDownloadedTracks
} from '../index'
import { AsyncStorage } from 'react-native'

describe('playCount', () => {
  test('should returns 0', () => {
    expect(
      playCount(null)
    ).toEqual(
      '0 次播放'
    )
  })

  test('should returns 万 count when greater than 10k', () => {
    expect(
      playCount(10e5)
    ).toEqual(
       `100 万次播放`
      )
  })
})

test('changeCoverImgUrl', () => {
  const arr = [{
    coverImgUrl: '1',
    picUrl: '2',
    img1v1Url: '3'
  }]
  expect(changeCoverImgUrl(arr))
    .toEqual([{
      coverImgUrl: '1?param=300y300',
      picUrl: '2?param=300y300',
      img1v1Url: '3?param=300y300'
    }])
})

test('changeCoverImgUrl default img1v1Url', () => {
  const arr = [{
    coverImgUrl: '1',
    picUrl: '2'
  }]
  expect(changeCoverImgUrl(arr))
    .toEqual([{
      coverImgUrl: '1?param=300y300',
      picUrl: '2?param=300y300',
      img1v1Url: PLACEHOLDER_IMAGE
    }])
})

test('getDownloadedTracks', () => {
  getDownloadedTracks().then((res) => {
    expect(res).toEqual([])
  })
})

describe('parseLyrics', () => {
  test('real data', () => {
    // tslint:disable-next-line
    const lrcs = "[00:00.00] 作曲 : Sia Furler/Greg Kurstin\n[00:01.00] 作词 : Sia Furler/Greg Kurstin\n[00:10.690]Come on, come on\n[00:11.800]Turn the radio on\n[00:13.320]It's Friday night and I won't be long\n[00:15.950]Gotta do my hair\n[00:17.250]I put my make-up on\n[00:18.610]It's Friday night and I won't be long\n[00:21.400]Til I hit the dance floor\n[00:22.940]Hit the dance floor\n[00:23.990]I got all I need\n[00:26.580]No I ain't got cash\n[00:28.120]No I ain't got cash\n[00:29.310]But I got you baby\n[00:31.990]Baby I don't need dollar bills to have fun tonight\n[00:36.060](I love cheap thrills)\n[00:37.410]Baby I don't need dollar bills to have fun tonight\n[00:41.310](I love cheap thrills)\n[00:43.050]But I don't need no money\n[00:48.320]As long as I can feel the beat\n[00:53.760]I don't need no money\n[00:59.060]As long as I keep dancing\n[01:04.310]Come on, come on\n[01:05.480]Turn the radio on\n[01:07.040]It's Saturday night and I won't be long\n[01:09.510]Gotta paint my nails\n[01:10.860]Put my high heels on\n[01:12.260]It's Saturday night and I won't be long\n[01:14.860]Til I hit the dance floor\n[01:16.580]Hit the dance floor\n[01:17.590]I got all I need\n[01:20.170]No I ain't got cash\n[01:21.710]No I ain't got cash\n[01:22.890]But I got you baby\n[01:24.910]Baby I don't need dollar bills to have fun tonight\n[01:29.450](I love cheap thrills)\n[01:30.490]Baby I don't need dollar bills to have fun tonight\n[01:34.710](I love cheap thrills)\n[01:36.040]But I don't need no money\n[01:41.610]As long as I can feel the beat\n[01:46.940]I don't need no money\n[01:52.270]As long as I keep dancing\n[02:01.510](I love cheap thrills)\n[02:07.060](I love cheap thrills)\n[02:07.940]But I don't need no money\n[02:13.230]As long as I can feel the beat\n[02:18.540]I don't need no money\n[02:23.790]As long as I keep dancing\n[02:28.280]Oh, oh\n[02:29.200]Baby I don't need dollar bills to have fun tonight\n[02:32.690](I love cheap thrills)\n[02:34.240]Baby I don't need dollar bills to have fun tonight\n[02:38.300](I love cheap thrills)\n[02:39.570]But I don't need no money\n[02:45.040]As long as I can feel the beat\n[02:50.460]I don't need no money\n[02:55.720]As long as I keep dancing\n[03:01.750]La, la, la, la, la, la\n[03:04.120](I love cheap thrills)\n[03:07.250]La, la, la, la, la, la\n[03:10.600](I love cheap thrills)\n[03:12.430]La, la, la, la, la, la\n[03:16.330](I love cheap thrills)\n[03:17.630]La, la, la, la, la, la\n[03:21.380](I love cheap thrills)\n"
    // tslint:disable-next-line
    const translation = "[by:Niconiconi猴]\n[00:10.690]快，快，快\n[00:11.800]快把收音机调到最大\n[00:13.320]周五的夜晚不会太漫长\n[00:15.950]梳理头发\n[00:17.250]化好美妆\n[00:18.610]周五的夜晚总是一刻千金\n[00:21.400]陶醉在舞池中肆意狂欢\n[00:22.940]载歌载舞，钟鼓乐之\n[00:23.990]我已收获我所需的全部\n[00:26.580]不，无关钱财\n[00:28.120]不，无关富贵\n[00:29.310]有你就已足够\n[00:31.990]亲爱的，我不要用金钱来换取一时欢乐\n[00:36.060]简简单单就已足够\n[00:37.410]亲爱的，我不要用钱财换来苟且的欢愉\n[00:41.310]简简单单就是我想要的\n[00:43.050]我不需要任何钱财\n[00:48.320]只要能感受着节奏一起摇摆\n[00:53.760]钱财乃身外之物\n[00:59.060]只要我能随着音乐一起舞动\n[01:04.310]快，快，快\n[01:05.480]快把收音机调到最大\n[01:07.040]周六的晚上总是如此短暂\n[01:09.510]涂上亮丽的指甲\n[01:10.860]踩着我们的恨天高\n[01:12.260]一刻千金，快快开始周六的狂欢之夜\n[01:14.860]在舞池中肆意狂欢\n[01:16.580]载歌载舞，随心摇摆\n[01:17.590]我已收获我所需要的全部\n[01:20.170]不，无关钱财\n[01:21.710]不，无关富贵\n[01:22.890]有你就已足够\n[01:24.910]宝贝，我不要用钱财换来一时的狂欢\n[01:29.450]简简单单就已足够\n[01:30.490]宝贝。我不要用金钱换来苟且的欢愉\n[01:34.710]简简单单就是我想要的\n[01:36.040]我不需要任何钱财\n[01:41.610]只要能感受着节奏一起摇摆\n[01:46.940]钱财乃身外之物\n[01:52.270]只要我能随着音乐一起舞动\n[02:01.510]简简单单亦是快乐\n[02:07.060]平平淡淡就已足够\n[02:07.940]我不需要任何钱财\n[02:13.230]只要能感受着节奏一起摇摆\n[02:18.540]钱财乃身外之物\n[02:23.790]只要我能随着音乐一起舞动\n[02:28.280]哦~\n[02:29.200]我不要用钱财换取一时的狂欢\n[02:32.690]简简单单就已足够\n[02:34.240]我不要用金钱换来苟且的欢愉\n[02:38.300]简简单单就是我想要的\n[02:39.570]宝贝，我不需要任何钱财\n[02:45.040]只要能感受着节奏一起摇摆\n[02:50.460]钱财乃身外之物\n[02:55.720]只要我能随着音乐一起舞动\n[03:01.750]啦啦啦~\n[03:04.120]简简单单亦是快乐\n[03:07.250]啦啦啦~\n[03:10.600]平平淡淡就已足够\n[03:12.430]啦啦啦~\n[03:16.330]简简单单就是我想要的\n[03:17.630]啦啦啦~\n[03:21.380]简简单单亦是快乐\n"
    // tslint:disable-next-line
    const parsed = [{ "time": 0, "text": '作曲 : Sia Furler/Greg Kurstin', "translation": "" }, { "time": 1, "text": "作词 : Sia Furler/Greg Kurstin", "translation": "" }, { "time": 10.69, "text": "Come on, come on", "translation": "快，快，快" }, { "time": 11.8, "text": "Turn the radio on", "translation": "快把收音机调到最大" }, { "time": 13.32, "text": "It's Friday night and I won't be long", "translation": "周五的夜晚不会太漫长" }, { "time": 15.95, "text": "Gotta do my hair", "translation": "梳理头发" }, { "time": 17.25, "text": "I put my make-up on", "translation": "化好美妆" }, { "time": 18.61, "text": "It's Friday night and I won't be long", "translation": "周五的夜晚总是一刻千金" }, { "time": 21.4, "text": "Til I hit the dance floor", "translation": "陶醉在舞池中肆意狂欢" }, { "time": 22.94, "text": "Hit the dance floor", "translation": "载歌载舞，钟鼓乐之" }, { "time": 23.99, "text": "I got all I need", "translation": "我已收获我所需的全部" }, { "time": 26.58, "text": "No I ain't got cash", "translation": "不，无关钱财" }, { "time": 28.12, "text": "No I ain't got cash", "translation": "不，无关富贵" }, { "time": 29.31, "text": "But I got you baby", "translation": "有你就已足够" }, { "time": 31.99, "text": "Baby I don't need dollar bills to have fun tonight", "translation": "亲爱的，我不要用金钱来换取一时欢乐" }, { "time": 36.06, "text": "(I love cheap thrills)", "translation": "简简单单就已足够" }, { "time": 37.41, "text": "Baby I don't need dollar bills to have fun tonight", "translation": "亲爱的，我不要用钱财换来苟且的欢愉" }, { "time": 41.31, "text": "(I love cheap thrills)", "translation": "简简单单就是我想要的" }, { "time": 43.05, "text": "But I don't need no money", "translation": "我不需要任何钱财" }, { "time": 48.32, "text": "As long as I can feel the beat", "translation": "只要能感受着节奏一起摇摆" }, { "time": 53.76, "text": "I don't need no money", "translation": "钱财乃身外之物" }, { "time": 59.06, "text": "As long as I keep dancing", "translation": "只要我能随着音乐一起舞动" }, { "time": 64.31, "text": "Come on, come on", "translation": "快，快，快" }, { "time": 65.48, "text": "Turn the radio on", "translation": "快把收音机调到最大" }, { "time": 67.04, "text": "It's Saturday night and I won't be long", "translation": "周六的晚上总是如此短暂" }, { "time": 69.51, "text": "Gotta paint my nails", "translation": "涂上亮丽的指甲" }, { "time": 70.86, "text": "Put my high heels on", "translation": "踩着我们的恨天高" }, { "time": 72.26, "text": "It's Saturday night and I won't be long", "translation": "一刻千金，快快开始周六的狂欢之夜" }, { "time": 74.86, "text": "Til I hit the dance floor", "translation": "在舞池中肆意狂欢" }, { "time": 76.58, "text": "Hit the dance floor", "translation": "载歌载舞，随心摇摆" }, { "time": 77.59, "text": "I got all I need", "translation": "我已收获我所需要的全部" }, { "time": 80.17, "text": "No I ain't got cash", "translation": "不，无关钱财" }, { "time": 81.71, 'text': "No I ain't got cash", "translation": "不，无关富贵" }, { "time": 82.89, "text": "But I got you baby", "translation": "有你就已足够" }, { "time": 84.91, "text": "Baby I don't need dollar bills to have fun tonight", "translation": "宝贝，我不要用钱财换来一时的狂欢" }, { "time": 89.45, "text": "(I love cheap thrills)", "translation": "简简单单就已足够" }, { "time": 90.49, "text": "Baby I don't need dollar bills to have fun tonight", "translation": "宝贝。我不要用金钱换来苟且的欢愉" }, { "time": 94.71, "text": "(I love cheap thrills)", "translation": "简简单单就是我想要的" }, { "time": 96.04, "text": "But I don't need no money", "translation": "我不需要任何钱财" }, { "time": 101.61, "text": "As long as I can feel the beat", "translation": "只要能感受着节奏一起摇摆" }, { "time": 106.94, "text": "I don't need no money", "translation": "钱财乃身外之物" }, { "time": 112.27, "text": "As long as I keep dancing", "translation": "只要我能随着音乐一起舞动" }, { "time": 121.51, "text": "(I love cheap thrills)", "translation": "简简单单亦是快乐" }, { "time": 127.06, "text": "(I love cheap thrills)", "translation": "平平淡淡就已足够" }, { "time": 127.94, "text": "But I don't need no money", "translation": "我不需要任何钱财" }, { "time": 133.23, "text": "As long as I can feel the beat", "translation": "只要能感受着节奏一起摇摆" }, { "time": 138.54, "text": "I don't need no money", "translation": "钱财乃身外之物" }, { "time": 143.79, "text": "As long as I keep dancing", "translation": "只要我能随着音乐一起舞动" }, { "time": 148.28, "text": "Oh, oh", "translation": "哦~" }, { "time": 149.2, "text": "Baby I don't need dollar bills to have fun tonight", "translation": "我不要用钱财换取一时的狂欢" }, { "time": 152.69, "text": "(I love cheap thrills)", "translation": "简简单单就已足够" }, { "time": 154.24, "text": "Baby I don't need dollar bills to have fun tonight", "translation": "我不要用金钱换来苟且的欢愉" }, { "time": 158.3, "text": "(I love cheap thrills)", "translation": "简简单单就是我想要的" }, { "time": 159.57, "text": "But I don't need no money", "translation": "宝贝，我不需要任何钱财" }, { "time": 165.04, "text": "As long as I can feel the beat", "translation": "只要能感受着节奏一起摇摆" }, { "time": 170.46, "text": "I don't need no money", "translation": "钱财乃身外之物" }, { "time": 175.72, "text": "As long as I keep dancing", "translation": "只要我能随着音乐一起舞动" }, { "time": 181.75, "text": "La, la, la, la, la, la", "translation": "啦啦啦~" }, { "time": 184.12, "text": "(I love cheap thrills)", "translation": "简简单单亦是快乐" }, { "time": 187.25, "text": "La, la, la, la, la, la", "translation": "啦啦啦~" }, { "time": 190.6, "text": "(I love cheap thrills)", "translation": "平平淡淡就已足够" }, { "time": 192.43, "text": "La, la, la, la, la, la", "translation": "啦啦啦~" }, { "time": 196.33, "text": "(I love cheap thrills)", "translation": "简简单单就是我想要的" }, { "time": 197.63, "text": "La, la, la, la, la, la", "translation": "啦啦啦~" }, { "time": 201.38, "text": "(I love cheap thrills)", "translation": "简简单单亦是快乐" }]
    expect(
      parseLyrics(lrcs, translation)
    ).toEqual(parsed)
  })
})
