'use client'

/** Muted, looping background-style video — for B-roll with no identifiable people. */
export function AmbientReel({ src, poster, ratio = '9 / 16' }: { src: string; poster: string; ratio?: string }) {
  return (
    <div style={{ position: 'relative', aspectRatio: ratio, borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(76,99,199,0.18)', background: 'var(--ink)' }}>
      <video
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
      />
      <div style={{ position: 'absolute', inset: 0, boxShadow: 'inset 0 -60px 60px -40px rgba(0,0,0,0.5)', pointerEvents: 'none' }} />
    </div>
  )
}
