import * as React from 'react'
import { ITrack } from '../services/api'
import { get } from 'lodash'
import { emitter } from '../utils'
import { IPlayerProps as IProps } from '../interfaces'

// tslint:disable-next-line:no-var-requires
const Video = require('react-native-video').default

// tslint:disable-next-line:no-var-requires
const MusicControl = require('react-native-music-control')

interface IState {
  duration: number
  currentTime: number
}

class Player extends React.Component<IProps, IState> {

  private audio: any

  constructor(props: IProps) {
    super(props)
    this.state = {
      duration: 0,
      currentTime: 0
    }
  }

  componentWillReceiveProps(nextProps: IProps) {
  }

  componentDidMount() {
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
    emitter.addListener('song.change', () => {
      if (this.audio) {
        this.audio.seek(0)
      }
      this.setState({
        currentTime: 0
      } as IState)
    })
  }

  componentWillUnmount () {
    MusicControl.resetNowPlaying()
  }

  render() {
    const {
      track,
      status,
      mode
    } = this.props

    const paused = status === 'PAUSED'
    const repeat = mode === 'REPEAT'
    const uri = get(track, 'mp3Url', false)
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
        onTimedMetadata={this.onTimedMetadata}
        onError={this.onError}
        progressUpdateInterval={1000.0}
        onLoadStart={() => console.log('start load')}
        onLoad={this.onLoad(track)}
        onBuffer={() => console.log('buffering')}
        onProgress={this.onProgress}
        onEnd={this.onEnd}
      /> : null
    )
  }

  mapAudio = (component: any) => {
    this.audio = component
  }

  onError = (e: any) => {
    console.log(e)
    this.props.changeStatus('ERROR')
  }

  onTimedMetadata = (param: any) => {
    console.log(param)
  }

  togglePlay = () => {
    const { status } = this.props
    if (status === 'PLAYING') {
      this.props.changeStatus('PAUSED')
    } else {
      this.props.changeStatus('PLAYING')
    }
  }

  onLoad = (track: ITrack) => ({ duration }: { duration: number }) => {
    this.setState({
      duration
    } as IState)
    MusicControl.setNowPlaying({
      title: track.name,
      artwork: track.album.picUrl,
      artist: track.artists[0].name,
      duration
    })
  }

  onProgress = ({ currentTime }: { currentTime: number }) => {
    this.setState({
      currentTime
    } as IState)
    MusicControl.updatePlayback({
      elapsedTime: currentTime
    })
  }

  onEnd = () => {
    this.props.next()
  }
}

export default Player
