import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'

import { Container } from '@mui/material'

import SimplePlayer from '../compoments/SimplePlayer'
import exampleVideo from '../assets/肥肠抱歉.mp4'
import { WHEPClient } from '../libs/whep'

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

  const [room, setRoom] = useState('')
  const videoRef = useRef<HTMLVideoElement>(null)

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
    const pc = new RTCPeerConnection()
    window.pc = pc

    //Add recv only transceivers
    pc.addTransceiver('audio')
    pc.addTransceiver('video')

    pc.ontrack = (event) => {
      console.log(event)
      if (event.track.kind == 'video' && videoRef.current) {
        const video = videoRef.current
        video.srcObject = event.streams[0]
        video.controls = true
      }
    }
    //Create whep client
    const whep = new WHEPClient()

    const url = whepUrl(room)
    //const token = ""

    //Start viewing
    whep
      .view(pc, url, '')
      .then(() => {
        videoRef.current?.play()
      })
      .catch((err) => console.log(err))

    return () => {
      whep.stop().catch((err) => console.log(err))
    }
  }, [room])

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
          paddingTop: '20px'
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

        {room ? (
          <video
            id="stream-video"
            style={{ width: '100%', aspectRatio: '16/9' }}
            ref={videoRef}
            controls
            muted
          />
        ) : (
          <video
            id="unknown-video"
            style={{ width: '100%', aspectRatio: '16/9' }}
            src={exampleVideo}
            ref={videoRef}
            controls
            muted
          />
        )}
      </Container>
    </>
  )
}
