import Artplayer from 'artplayer'

import { useRef, useEffect, useState } from 'react'

type Props = {
  options: ArtPlayerOption
  widthHeightRatio?: string | number
  artplayerRef?: React.MutableRefObject<Artplayer | undefined>
  videoRef?: React.MutableRefObject<HTMLVideoElement | undefined>
}

type ArtPlayerOption = {
  url: string
  isLive?: boolean
  volume?: number
  muted?: boolean
  autoplay?: boolean
}

export default function SimplePlayer({
  options,
  widthHeightRatio: whRatio,
  artplayerRef,
  videoRef,
  ..._props
}: Props) {
  const { url } = options

  if (whRatio === undefined) {
    whRatio = '16/9'
  }

  const div = useRef<HTMLDivElement>(null)
  const [lastDiv, setLastDiv] = useState<HTMLDivElement>()
  const playerVideoElementRef = useRef<HTMLVideoElement>()

  const [artplayer, setArtplayer] = useState<Artplayer>()

  /**
   * get artplayer video element
   * if not exist, set to undefined
   * */
  useEffect(() => {
    if (lastDiv) {
      // get video element with class `art-video` in div
      const video = lastDiv.querySelector('video.art-video') as HTMLVideoElement
      if (video) {
        console.log('get artplayer video element', video)
        playerVideoElementRef.current = video
      } else {
        console.log('no artplayer video element')
      }
    } else {
      playerVideoElementRef.current = undefined
    }
  }, [lastDiv])

  useEffect(() => {
    if (div.current !== lastDiv) {
      setLastDiv(div.current ?? undefined)
    }
  }, [div, lastDiv])

  useEffect(() => {
    if (videoRef) {
      playerVideoElementRef.current = videoRef.current
    }
  }, [videoRef, playerVideoElementRef])

  useEffect(() => {
    if (div.current) {
      const art = new Artplayer({
        ...options,
        container: div.current,
        url
      })
      setArtplayer(art)
      return () => art.destroy()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [div])

  useEffect(() => {
    if (artplayer) {
      artplayer.switchUrl(url)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, !artplayer])

  useEffect(() => {
    if (artplayer && artplayerRef) {
      artplayerRef.current = artplayer
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!artplayer, artplayerRef])

  return (
    <div
      style={{
        width: '100%',
        aspectRatio: whRatio,
        padding: '0px',
        margin: '0px'
      }}
      ref={div}
    ></div>
  )
}
