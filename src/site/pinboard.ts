// import { newOpenLink } from '../actions'
import { newOpenLink } from '../actions'
import { pinboard } from '../conf.priv'
import { createHints, SurfingkeysUsage } from '../util'

const apitoken = pinboard.apitoken
const [user] = apitoken.split(':')
const validUser: boolean = apitoken && user && true || false

export const name = 'Pinboard'
export const prefix = 'p'
export const domains = ['pinboard.in']

export const keys: SiteKey[] = [
  {
    alias: 'pA',
    domains: ['*'], // global key
    category: SurfingkeysUsage.Misc,
    description: 'Add bookmark in Pinboard for current page',
    callback: () => { addPinboardBookmark() },
  },
  {
    alias: 'pa',
    domains: ['*'], // global key
    category: SurfingkeysUsage.Misc,
    description: 'Add bookmark in Pinboard from URL',
    callback: createHints('a[href]', (a) => { addPinboardBookmark(a?.getAttribute('href')) }),
  },
  {
    alias: 'cpa',
    domains: ['*'], // global key
    category: SurfingkeysUsage.Clipboard,
    description: 'Add bookmark in Pinboard from URL in clipboard',
    callback: () => { api.Clipboard.read(({ data }) => { addPinboardBookmark(data) }) },
  },
  {
    alias: 'pR',
    domains: ['*'], // global key
    category: SurfingkeysUsage.Misc,
    description: 'Add current page to Pinboard reading list',
    callback: () => { addPinboardBookmark(null, true) },
  },
  {
    alias: 'pr',
    domains: ['*'], // global key
    category: SurfingkeysUsage.Misc,
    description: 'Add URL to Pinboard reading list',
    callback: createHints('a[href]', (a) => { addPinboardBookmark(a?.getAttribute('href'), true) }),
  },
  {
    alias: 'cpr',
    domains: ['*'], // global key
    category: SurfingkeysUsage.Clipboard,
    description: 'Add URL to Pinboard reading list from clipboard',
    callback: () => { api.Clipboard.read(({ data }) => { addPinboardBookmark(data, true) }) },
  },
  {
    alias: 'pr0',
    domains: ['*'], // global key
    category: SurfingkeysUsage.Misc,
    description: 'Take to oldest unread item from Pinboard reading list',
    callback: newOpenLink('https://pinboard.in/oldest'),
  },
  {
    alias: 'prr',
    domains: ['*'], // global key
    category: SurfingkeysUsage.Misc,
    description: 'Take to a random unread item from Pinboard reading list',
    callback: newOpenLink('https://pinboard.in/random/?type=unread'),
  },
  {
    alias: 'pS',
    domains: ['*'], // global key
    category: SurfingkeysUsage.Misc,
    description: 'Search existing bookmark of current page in Pinboard',
    callback: newOpenLink(`https://pinboard.in/search/u:${user}/?query=${encodeURIComponent(window.location.href)}`),
    invalid: !validUser,
  },
]

export const searches: { [k: string]: SiteSearch } = {
  '<Space>': {
    name: 'Pinboard Search',
    search: `https://pinboard.in/search/u:${user}/?query=`,
    invalid: !validUser,
  },
  't': {
    name: 'Pinboard Tag',
    search: `https://pinboard.in/u:${user}/t:`,
    invalid: !validUser,
  },
}


async function addPinboardBookmark(url: string | null = null, later = false) {
  let t = '', d = ''
  if (url == null) {
    url = window.location.href
    t = encodeURIComponent(document.title)
    d = encodeURIComponent((document.getSelection() || '').toString())
  }
  else if (!url) { return }
  // else {
  //   const { title, description } = await getWebpageMeta(url)
  //   t = encodeURIComponent(title || '')
  //   d = encodeURIComponent(description || '')
  // }

  url = encodeURIComponent(url)

  if (later) {
    const u = `https://pinboard.in/add?later=yes&noui=yes&jump=close&url=${url}&title=${t}&description=${d}`
    // newOpenLink(u, { newTab: true, active: false })()
    const w = window.open(u, '_blank', 'toolbar=0,width=100,height=100,popup=yes')
    w?.blur()
  } else {
    const u = `https://pinboard.in/add?showtags=yes&url=${url}&title=${t}&description=${d}`
    window.open(u, 'Pinboard', 'toolbar=0,scrollbars=1,resizable=1,width=800,height=600,popup=yes')
  }
}
