import { SurfingkeysUsage } from '../util'
import { twitter as config } from '../conf.priv'
import { newOpenLink } from '../actions'

export const name = 'Twitter'
export const domains = ['twitter.com']
export const prefix = 'tw'

export const keys: SiteKey[] = [
  {
    alias: 'N',
    description: 'Open in Nitter.',
    category: SurfingkeysUsage.Misc,
    callback: newOpenInNitter(),
  },
]

export function getTwitterUri(url: string) {
  return url.replace(/(https?:\/\/)?(?:www\.)?twitter\.com\/?/, '')
}

export function newOpenInNitter(url = window.location.href, { newTab = false, active = true } = {}) {
  const uri = getTwitterUri(url)
  return newOpenLink(`https://${config.nitter[0]}/${uri}`, { newTab, active })
}