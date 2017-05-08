import * as React from 'react'
import MusicControl from 'react-native-music-control/index.ios.js'
import { IPlayerProps as IProps } from '../interfaces'
import Sound from 'react-native-sound'

class Player extends React.Component<IProps, any> {

  private audio: any

  private interval: number

  constructor(props: IProps) {
    super(props)
  }

  componentDidMount() {
    Sound.setCategory('Playback')
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

  componentWillReceiveProps(nextProps: IProps) {
    if (nextProps.uri !== this.props.uri) {
      if (this.audio) {
        this.audio.stop()
        this.audio.release()
      }
      this.audio = new Sound(nextProps.uri, null, (err) => {
        if (!err) {
          this.onLoadComplete(this.audio.getDuration())
          this.play()
        } else {
          this.onError()
        }
      })
    }

    if (nextProps.status === 'PAUSED') {
      this.pause()
    }

    if (nextProps.status === 'PLAYING') {
      this.play()
    }
  }

  componentWillUnmount() {
    MusicControl.resetNowPlaying()
  }

  play() {
    this.audio.play((success) => {
      if (success) {
        this.onEnd()
        this.props.changeStatus('PLAYING')
      } else {
        this.onError()
      }
    })
    this.interval = setInterval(() => {
      this.audio.getCurrentTime(this.onProgress)
    }, 250)
  }

  pause() {
    clearInterval(this.interval)
    this.props.changeStatus('PAUSED')
    this.audio.pause()
  }

  onError = () => {
    this.props.changeStatus('ERROR')
  }

  onLoadComplete = ( duration ) => {
    this.props.setDuration(duration)
    const { track } = this.props
    MusicControl.setNowPlaying({
      title: track.name,
      artwork: track.album.picUrl,
      artist: track.artists[0].name,
      duration
    })
  }

  onProgress = (currentTime) => {
    this.props.setCurrentTime(currentTime)
    if (!this.props.isSliding) {
      this.props.setSlideTime(currentTime)
    }
  }

  onEnd = () => {
    this.audio.release()
    this.props.next()
  }

  render() {
    return null
  }
}

export default Player
