/**
 * next/og's ImageResponse renderer (satori) has no Arabic glyphs in its
 * default fallback font — Arabic text renders as empty boxes unless a
 * font with Arabic coverage is explicitly loaded and passed in. Almarai
 * matches the site's actual body font.
 */
export async function loadOgFont(weight: '400' | '700' | '800' = '700'): Promise<ArrayBuffer> {
  const cssUrl = `https://fonts.googleapis.com/css2?family=Almarai:wght@${weight}&display=swap`
  // satori (next/og's renderer) only understands TTF/OTF, not WOFF2 — Google Fonts
  // serves WOFF2 to any UA that claims modern support, so we spoof an old one
  // that Google's UA-sniffing falls back to TTF for.
  const css = await fetch(cssUrl, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36' },
  }).then(r => r.text())

  const fontUrlMatch = css.match(/src: url\(([^)]+)\) format\('(?:truetype|woff)'\)/)
  const fontUrl = fontUrlMatch?.[1]
  if (!fontUrl) throw new Error('Could not resolve a non-WOFF2 Almarai font URL from Google Fonts CSS')

  return fetch(fontUrl).then(r => r.arrayBuffer())
}
