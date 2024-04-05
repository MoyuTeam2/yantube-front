import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import {Container} from '@mui/material';

import SimplePlayer from '../compoments/SimplePlayer'

function whepUrl(roomId: string) {
  const url = new URL('/whep')
  url.searchParams.set('app', 'live')
  url.searchParams.set('stream', roomId)
  return url.toString()
}

export default function Room() {
  const params = useParams()

  const [room, setRoom] = useState('')

  useEffect(() => {
    const { roomId } = params
    setRoom(roomId ?? '')
  }, [params])

  useEffect(() => {
    console.log('room:', room)
  })

  return (
    <>
      <div
        style={{
          width: '80%',
          height: '80%',
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: 'center',
          display: 'block',
        }}
      >
        <SimplePlayer url="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" />
      </div>
    </>
  )
}
