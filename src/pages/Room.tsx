import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'

import { Container } from '@mui/material'
import ReactPlayer from 'react-player'

import SimplePlayer from '../compoments/SimplePlayer'
import exampleVideo from '../assets/肥肠抱歉.mp4'
import { WHEPClient } from '../libs/whep'

declare global {
  interface Window {
    pc?: RTCPeerConnection
  }
}

const whepBaseURL = 'http://100.64.0.6:8081'

function whepUrl(roomId: string) {
  const url = new URL(`${whepBaseURL}/whep`)
  url.searchParams.set('app', 'live')
  url.searchParams.set('stream', roomId)
  url.searchParams.set('token', '')
  return url.toString()
}

export default function Room() {
  const params = useParams()
  const { roomId } = params

  const [room, setRoom] = useState(roomId ?? null)
  const videoRef = useRef<ReactPlayer>(null)

  const [videoStream, setVideoStream] = useState<MediaStream>()
  const [playing, setPlaying] = useState<boolean>()

  useEffect(() => {
    const { roomId } = params
    setRoom(roomId ?? '')
  }, [params])

  useEffect(() => {
    console.log('room:', room)
  }, [room])

  // setup whep client
  useEffect(() => {
    if (!room) return

    console.log('init webrtc')

    //Create peerconnection
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    })
    window.pc = pc

    //Add recv only transceivers
    pc.addTransceiver('audio')
    pc.addTransceiver('video')

    pc.ontrack = (event) => {
      console.log(event)
      if (event.track.kind == 'video') {
        setVideoStream(event.streams[0])
        // video.srcObject = event.streams[0]
        // video.controls = true
      }
    }
    //Create whep client
    const whep = new WHEPClient()

    const url = whepUrl(room)
    //const token = ""

    //Start viewing
    whep.view(pc, url, '').catch((err) => console.log(err))

    return () => {
      whep
        .stop()
        .catch((err) => console.log(err))
        .finally(() => {
          pc.close()
          window.pc = undefined
        })
    }
  }, [room])

  useEffect(() => {
    if (videoStream && playing === undefined) {
      setPlaying(true)
    }
  }, [videoStream, playing])

  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     if (videoRef.current) {
  //       console.log('remove src from video', videoRef.current)
  //       videoRef.current.removeAttribute('src')
  //     }
  //   }, 1)
  //   return () => clearInterval(timer)
  // }, [room, video])

  return (
    <>
      <Container
        maxWidth="xl"
        sx={{
          alignContent: 'center',
          justifyContent: 'center',
          marginTop: '20px'
        }}
      >
        {/* <SimplePlayer
          options={{
            // url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
            url: exampleVideo,
            isLive: true,
            autoplay: false
          }}
          videoRef={videoRef}
        /> */}

        <ReactPlayer
          style={{ aspectRatio: '16 / 9', margin: '0' }}
          width="100%"
          height="100%"
          ref={videoRef}
          muted
          controls
          playing={playing}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          url={videoStream || exampleVideo}
        />
      </Container>
    </>
  )
}
