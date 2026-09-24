/**
 * Saudi National Day (23 Sep) celebration theme — active for a fixed window only.
 *
 * The window is evaluated in the pre-paint head script (see `nationalDayHeadScript`)
 * so the green token overrides apply from the very first frame, and again on the
 * client by `NationalDay` to decide whether to mount the intro / ribbon / pixel sky.
 *
 * Preview after the window with `?national=1`, force off with `?national=0`
 * (remembered for the tab session).
 */
export const NATIONAL_DAY_WINDOW = {
  start: '2026-09-23T00:00:00+03:00',
  end: '2026-09-27T00:00:00+03:00', // exclusive — through the end of 26 Sep, Riyadh time
} as const

export const NATIONAL_DAY_EDITION = 96 // 96th National Day (1932 → 2026)

const OVERRIDE_KEY = 'haymanah-national'

/** Runs before paint. Sets `data-national="1"` on <html> when the theme is on. */
export const nationalDayHeadScript = `(function(){try{var o=null;var q=new URLSearchParams(location.search).get('national');if(q==='1'||q==='0'){o=q;sessionStorage.setItem('${OVERRIDE_KEY}',q)}else{o=sessionStorage.getItem('${OVERRIDE_KEY}')}var n=Date.now();var on=o==='1'||(o!=='0'&&n>=${Date.parse(NATIONAL_DAY_WINDOW.start)}&&n<${Date.parse(NATIONAL_DAY_WINDOW.end)});if(on){document.documentElement.setAttribute('data-national','1')}}catch(e){}})();`

/** Client-side check that mirrors the head script's decision. */
export function isNationalDayActive(): boolean {
  if (typeof document === 'undefined') return false
  return document.documentElement.getAttribute('data-national') === '1'
}
