import * as React from 'react'
import { ITrack } from '../services/api'
import { get } from 'lodash'
import { IPlayerProps as IProps } from '../interfaces'
import Video from 'react-native-video'
import MusicControl from 'react-native-music-control/index.ios.js'

import RNFS from 'react-native-fs'

interface IState {
  duration: number
  currentTime: number
}

class Player extends React.Component<IProps, any> {

  private audio: any

  constructor(props: IProps) {
    super(props)
  }

  componentDidMount() {
    RNFS.readDir(RNFS.DocumentDirectoryPath + '/files').then(result => {
      return console.log(result)
    })
    MusicControl.enableBackgroundMode(true)
    MusicControl.enableControl('play', true)
    MusicControl.enableControl('pause', true)
    MusicControl.enableControl('nextTrack', true)
    MusicControl.enableControl('previousTrack', true)
    MusicControl.enableControl('seekForward', false)
    MusicControl.enableControl('seekBackward', false)
    MusicControl.on('play', () => {
      this.props.changeStatus('PLAYING')
    })
    MusicControl.on('pause', () => {
      this.props.changeStatus('PAUSED')
    })
    MusicControl.on('nextTrack', () => {
      this.props.next()
    })
    MusicControl.on('previousTrack', () => {
      this.props.prev()
    })
  }

  componentWillUnmount () {
    MusicControl.resetNowPlaying()
  }

  render() {
    const {
      track,
      status,
      mode,
      uri
    } = this.props

    const paused = status !== 'PLAYING'
    const repeat = mode === 'REPEAT'
    return (
      uri ? <Video
        style={{ height: 0, width: 0 }}
        ref={this.mapAudio}
        source={{ uri }}
        volume={1.0}
        muted={false}
        paused={paused}
        repeat={repeat}
        playInBackground={true}
        playWhenInactive={true}
        onError={this.onError}
        onLoad={this.onLoad(track)}
        onTimedMetadata={this.onTimedMetadata}
        onProgress={this.onProgress}
        onEnd={this.onEnd}
      /> : null
    )
  }

  mapAudio = (component: any) => {
    this.audio = component
  }

  onError = (e: any) => {
    this.props.changeStatus('PAUSED')
  }

  onTimedMetadata = (param: any) => {
    console.log('on meta')
    console.log(param)
  }

  onLoad = (track: ITrack) => ({ duration }: { duration: number }) => {
    this.props.setDuration(duration)
    MusicControl.setNowPlaying({
      title: track.name,
      artwork: track.album.picUrl,
      artist: track.artists[0].name,
      duration
    })
  }

  onProgress = ({ currentTime }: { currentTime: number }) => {
    this.props.setCurrentTime(currentTime)
  }

  onEnd = () => {
    this.props.next()
  }
}

export default Player
