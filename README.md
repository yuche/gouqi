# 🐸 枸杞 🐸
枸杞是一个跨平台的计时 App。你可以点击 ▶️ 开始计时，点击 ⏸ 停止计时，枸杞会帮助你统计计时的总时间。除去计时之外，枸杞通过网易云音乐还提供音乐播放、信息浏览等乱七八糟的功能，让你计更多的时。

枸杞在实现上使用了彻底分离的 MVC 架构，在 M 层和 C 层有 260 多个测试来保证数据和逻辑的正确，且测试覆盖率达到了 99%。更多关于枸杞的技术细节，可以查看 [枸杞的由来和技术栈](https://github.com/yuche/gouqi/issues/1) 和 [Roadmap without any promises](https://github.com/yuche/gouqi/issues/2)。

## 交互
|  主要功能 | 歌单 | 下载 |
| :———: | :———: | :———:|
| ![主要功能](https://ooo.0o0.ooo/2017/06/08/5938c0d26bb00.gif) | ![歌单](https://ooo.0o0.ooo/2017/06/08/5938c0de05c00.gif
) | ![下载](https://ooo.0o0.ooo/2017/06/08/5938c0d5139f9.gif
)

| 艺术家 | 播放 | 歌词 |
| :———: | :———: | :———:|
| ![艺术家](https://ooo.0o0.ooo/2017/06/08/5938c0d26bb00.gif
) | ![歌单](https://ooo.0o0.ooo/2017/06/08/5938c0dd8c706.gif
) | ![歌词](https://ooo.0o0.ooo/2017/06/08/5938c0dbcec2f.gif)


## 安装与调试
首先确保你已经安装了 Node.js 和 Xcode/Android 开发环境。

```bash
brew install yarn // Or npm install -g yarn
yarn install // 安装依赖
yarn run ios // 跑 iOS
yarn run android // 跑 Android
yarn test // 跑测试
yarn run remotedev // 打开调试器
```

## FAQ
<details>
  <summary>为什么叫「枸杞」？</summary>
因为我打飞机太多了，需要多吃点枸杞补补身子。
</details>

<details>
  <summary>开门，快递/查水表/社区送温暖/清华大学录取通知书！</summary>
没有网购，家里长期停水没有水表，天气太热了不需要社区送温暖，考不上清华没有录取通知书。
</details>

<details>
  <summary>我不懂这方面的开发，有没有直接可以下载安装试用的渠道？</summary>
没有，你得自己编译。如果我提供了这个渠道就会有 bad guys 发律师信给我。
</details>

<details>
  <summary>楼主是气象专家吗？</summary>
不是，我对天气预报没有任何研究。
</details>

## License
Do What the Fuck You Want only if you DON’T  summit to App Store or any store that sells  Apps.