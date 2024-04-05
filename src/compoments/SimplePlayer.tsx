import Artplayer from 'artplayer'

import { useRef, useEffect, useState } from 'react'

type Options = {
  url: string
}

export default function SimplePlayer({ url, ...options }: Options) {
  const div = useRef<HTMLDivElement>(null)
  const [artplayer, setArtplayer] = useState<Artplayer>()

  useEffect(() => {
    if (div.current) {
      const art = new Artplayer({
        container: div.current,
        url,
        ...options
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

  return <div ref={div}></div>
}
