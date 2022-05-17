import { newOpenLink } from '../actions'
import { SurfingkeysUsage } from '../util'
import { youtube as config } from '../conf.priv'

export const name = 'Youtube'
export const domains = ['youtube.com']
export const prefix = 'yt'


export const keys: SiteKey[] = [
  {
    alias: 'gp',
    domains: ['youtube.com', config.ytLocal],
    description: 'Open current video in Piped.',
    category: SurfingkeysUsage.Misc,
    callback: newOpenInPiped(),
  },
  {
    alias: 'gl',
    domains: ['youtube.com', config.piped],
    description: 'Open current video in Piped.',
    category: SurfingkeysUsage.Misc,
    callback: newOpenInYTLocal(),
  },
]

export function getYoutubeVid(url: string) {
  const m = url.match(/^https?:\/\/(?:www\.)?youtube\.com\/watch\?(.*)$/)
  if (!m) return null
  const q = new URLSearchParams(m[1])
  return q.get('v')
}

export function getYoutubeUri(url: string) {
  const rePiped = new RegExp(`^https?://${config.piped}/`)
  const reYtLocal = new RegExp(`^https?://${config.ytLocal}/`)
  return url.replace(rePiped, '')
    .replace(reYtLocal, '')
    .replace(/(https?:\/\/)?(?:www\.)?youtube\.com\/?/, '')
}

export function newOpenInPiped(url = window.location.href, { newTab = false, active = true } = {}) {
  const uri = getYoutubeUri(url)
  return newOpenLink(`https://${config.piped}/${uri}`, { newTab, active })
}

export function newOpenInYTLocal(url = window.location.href, { newTab = false, active = true } = {}) {
  const uri = getYoutubeUri(url)
  return newOpenLink(`https://${config.ytLocal}/https://www.youtube.com/${uri}`, { newTab, active })
}