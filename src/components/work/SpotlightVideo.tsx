'use client'

import { useRef, useState } from 'react'

/** Poster + play button, click to reveal video with sound — used when the footage features a real person on camera. */
export function SpotlightVideo({ src, poster, ratio = '9 / 16' }: { src: string; poster: string; ratio?: string }) {
  const [playing, setPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  return (
    <div style={{ position: 'relative', aspectRatio: ratio, borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(76,99,199,0.18)', background: 'var(--ink)' }}>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        controls={playing}
        playsInline
        preload="metadata"
        onPause={() => setPlaying(false)}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
      />
      {!playing && (
        <button
          onClick={() => {
            setPlaying(true)
            videoRef.current?.play()
          }}
          aria-label="تشغيل الفيديو"
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(10,8,3,0.18)', border: 'none', cursor: 'pointer', padding: 0,
          }}
        >
          <span style={{
            width: 62, height: 62, borderRadius: '50%',
            background: 'var(--gold-grad)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 28px rgba(0,0,0,0.4)',
          }}>
            <svg viewBox="0 0 24 24" width={22} height={22} fill="var(--on-gold)" style={{ marginInlineStart: 3 }}>
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </button>
      )}
    </div>
  )
}
