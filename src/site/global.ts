import {
  copyImageURL,
  copyMarkdownLink,
  copyOrgLink,
  newCopyURLPath,
  newOpenImage,
  newOpenLink,
} from '../actions'

import { newOpenRepoFromClipboard } from './github'
import { createHints, isBrowser, SurfingkeysUsage } from '../util'

export const name = 'Global'
export const domains = ['*']

export const keys: SiteKey[] = [
  {
    alias: ';P',
    map: 'p',
    replace: true,
    category: SurfingkeysUsage.Help,
    description: 'Enter ephemeral PassThrough mode to temporarily suppress SurfingKeys',
  },
  {
    alias: 'F',
    map: 'gf',
    category: SurfingkeysUsage.MouseClick,
    description: 'Open a link in non-active new tab',
  },
  {
    alias: 'C',
    map: 'af',
    category: SurfingkeysUsage.MouseClick,
    description: 'Open a link in active new tab',
  },
  {
    alias: 'zf',
    category: SurfingkeysUsage.MouseClick,
    description: 'Open link URL in vim editor',
    callback: createHints('a[href]', (a) => {
      const h = a && a.getAttribute('href') || ''
      api.Front.showEditor(h, (url) => { newOpenLink(url)(), 'url' }, 'url')
    }),
  },
  // {
  //   alias: 'nf',
  //   category: SurfingkeysUsage.MouseClick,
  //   description: 'Open supported link URL in 3rd party site, e.g. Twitter -> Nitter',
  //   callback: open3rdPartyLink,
  // },
  {
    alias: 'w',
    map: 'k',
    category: SurfingkeysUsage.Scroll,
    description: 'Scroll up',
  },
  {
    alias: 's',
    map: 'j',
    category: SurfingkeysUsage.Scroll,
    description: 'Scroll down',
  },
  {
    alias: 'K',
    map: 'e',
    category: SurfingkeysUsage.Scroll,
    description: 'Scroll half page up',
  },
  {
    alias: 'J',
    map: 'd',
    category: SurfingkeysUsage.Scroll,
    description: 'Scroll half page down',
  },
  {
    alias: 'g#',
    category: SurfingkeysUsage.Scroll,
    description: 'Scroll to element targeted by URL hash',
    callback: scrollToHash,
  },
  {
    alias: 'gi',
    category: SurfingkeysUsage.PageNav,
    description: 'Edit current URL with vim editor',
    callback: () => { api.Front.showEditor(window.location.href, (url) => { newOpenLink(url)() }) },
  },
  {
    alias: 'gI',
    category: SurfingkeysUsage.PageNav,
    description: 'View image in new tab',
    callback: newOpenImage({ newTab: true }),
  },
  {
    alias: 'yp',
    category: SurfingkeysUsage.Clipboard,
    description: 'Copy URL path of current page',
    callback: newCopyURLPath(),
  },
  {
    alias: 'yI',
    category: SurfingkeysUsage.Clipboard,
    description: 'Copy Image URL',
    // TODO: use navigator.clipboard
    callback: copyImageURL,
  },
  {
    alias: 'yO',
    category: SurfingkeysUsage.Clipboard,
    description: 'Copy page URL/Title as Org-mode link',
    callback: copyOrgLink,
  },
  {
    alias: 'yM',
    category: SurfingkeysUsage.Clipboard,
    description: 'Copy page URL/Title as Markdown link',
    callback: copyMarkdownLink,
  },
  {
    alias: ';E',
    map: ';s',
    replace: true,
    category: SurfingkeysUsage.Settings,
    description: 'Edit Settings',
  },
  {
    alias: '=w',
    category: SurfingkeysUsage.Misc,
    description: 'Lookup whois information for domain',
    callback: newShowWhois(),
  },
  {
    alias: '=d',
    category: SurfingkeysUsage.Misc,
    description: 'Lookup dns information for domain',
    callback: newShowDNS(),
  },
  {
    alias: '=D',
    category: SurfingkeysUsage.Misc,
    description: 'Lookup all information for domain',
    callback: newShowDNS({ verbose: true }),
  },
  {
    alias: '=c',
    category: SurfingkeysUsage.Misc,
    description: 'Show Google\'s cached version of page',
    callback: newShowGoogleCache(),
  },
  {
    alias: '=a',
    category: SurfingkeysUsage.Misc,
    description: 'Show Archive.org Wayback Machine for page',
    callback: newShowWayback(),
  },
  {
    alias: '=t',
    category: SurfingkeysUsage.Misc,
    description: 'Show txtify.it version of page',
    callback: newShowTxtifyIt(),
  },
  // {
  //   alias: '=r',
  //   category: SurfingkeysUsage.Misc,
  //   description: 'Subscribe to RSS feed for page',
  //   callback: rssSubscribe(),
  // },
  {
    alias: '=s',
    category: SurfingkeysUsage.Misc,
    description: 'Speed read page',
    callback: showSpeedReader,
  },
  {
    alias: 'gxE',
    map: 'gxt',
    category: SurfingkeysUsage.Tabs,
    description: 'Close tab to left',
  },
  {
    alias: 'gxR',
    map: 'gxT',
    category: SurfingkeysUsage.Tabs,
    description: 'Close tab to right',
  },
  {
    alias: '\\cgh',
    category: SurfingkeysUsage.Clipboard,
    description: 'Open clipboard string as GitHub path (e.g. \'torvalds/linux\')',
    callback: newOpenRepoFromClipboard(),
  },
  // {
  //   alias: ';se',
  //   category: SurfingkeysUsage.Settings,
  //   description: 'Edit site settings',
  //   callback: editSiteSettings,
  // },

  // Chrome only keys
  {
    alias: ';S',
    category: SurfingkeysUsage.ChromeURLs,
    description: 'Open Browser settings',
    callback: openBrowserSettings,
    invalid: !isBrowser('Chrome'),
  },

  // Firefox only keys

  // TODO: Not working: browser.tabs only accesible from background scripts
  // {
  //   alias: 'gr',
  //   category: SurfingkeysUsage.Tabs,
  //   description: 'Turn on reader view (Firefox only)',
  //   callback: async() => {
  //     const t = await browser.tabs.toggleReaderMode()
  //   },
  //   invalid: !isBrowser('Firefox'),
  // },
]


// function editSiteSettings() {
//   let configStr = localStorage.getItem('surfingkeys.sites.config') || '{}'
//   try {
//     configStr = JSON.stringify(JSON.parse(configStr), null, 2)
//   } catch(e) {
//     // do nothing
//   }
//   api.Front.showEditor(
//     configStr,
//     (str) => {
//       try {
//         localStorage.setItem('surfingkeys.sites.config', str)
//         api.Front.showBanner('Site settings saved')
//       } catch(e) {
//         api.Front.showBanner(`Failed to save site settings - ${e}`)
//       }
//     },
//     'url'
//   )
// }

// function open3rdPartyLink() {
//   const reTwitter = /^https?:\/\/(?:www\.)?twitter\.com\/(.*)$/i
//   const reInstagram = /^https?:\/\/(?:www\.)?instagram\.com\/p\/([^/]+)/i
//   const reReddit = /^https?:\/\/(?:www\.)?reddit\.com\/r\/([^/]+)/i

//   const elements: { [k: string]: HTMLElement } = {}
//   document.querySelectorAll('a[href]').forEach((a) => {
//     if (!(a instanceof HTMLElement)) { return }

//     const url = a.getAttribute('href') || ''
//     if (!url) { return }

//     let m = reTwitter.exec(url)

//     const u = new URL(a.getAttribute('href') || '')

//     if (u.hash.length === 0 && reHost.test(u.hostname)) {
//       const rePathRes = rePath.exec(u.pathname)
//       if (rePathRes === null || rePathRes.length !== 2) {
//         return
//       }
//       if (!isElementInViewport(a)) {
//         return
//       }

//       const asin = rePathRes[1]

//       if (elements[asin] !== undefined) {
//         if (!(elements[asin].innerText.trim().length === 0 && a.innerText.trim().length > 0)) {
//           return
//         }
//       }

//       elements[asin] = a
//     }
//   })

//   return api.Hints.create(Object.values(elements), api.Hints.dispatchMouseClick)
// }

function scrollToHash(hash?: string) {
  const h = (hash || window.location.hash || '').replace(/^#/, '')
  const e = document.getElementById(h) || document.querySelector(`[name="${h}"]`)
  e && e.scrollIntoView({ behavior: 'smooth' })
}


function newShowWhois({ hostname = window.location.hostname } = {}) {
  const ddossierUrl = /*#__PURE__*/'http://centralops.net/co/DomainDossier.aspx'
  return newOpenLink(`${ddossierUrl}?dom_whois=true&addr=${hostname}`, { newTab: true })
}

function newShowDNS({ hostname = window.location.hostname, verbose = false } = {}) {
  const ddossierUrl = /*#__PURE__*/'http://centralops.net/co/DomainDossier.aspx'
  const url = verbose
    ? `${ddossierUrl}?dom_whois=true&dom_dns=true&traceroute=true&net_whois=true&svc_scan=true&addr=${hostname}`
    : `${ddossierUrl}?dom_dns=true&addr=${hostname}`
  return newOpenLink(url, { newTab: true })
}

function newShowGoogleCache({ href = window.location.href } = {}) {
  const googleCacheUrl = 'https://webcache.googleusercontent.com/search?q=cache:'
  return newOpenLink(`${googleCacheUrl}${href}`, { newTab: true })
}

function newShowWayback({ href = window.location.href } = {}) {
  const waybackUrl = 'https://web.archive.org/web/*/'
  return newOpenLink(`${waybackUrl}${href}`, { newTab: true })
}

function newShowTxtifyIt({ href = window.location.href } = {}) {
  const txtify = 'https://txtify.it/'
  return newOpenLink(`${txtify}${href}`, { newTab: true })
}

function showSpeedReader() {
  const script = document.createElement('script')
  script.innerHTML = `(() => {
    const sq = window.sq || {}
    window.sq = sq
    if (sq.script) {
      sq.again()
    } else if (sq.context !== "inner") {
      sq.bookmarkletVersion = "0.3.0"
      sq.iframeQueryParams = { host: "//squirt.io" }
      sq.script = document.createElement("script")
      sq.script.src = \`\${sq.iframeQueryParams.host}/bookmarklet/frame.outer.js\`
      document.body.appendChild(sq.script)
    }
  })()`
  document.body.appendChild(script)
}

function openBrowserSettings() {
  switch (api.getBrowserName()) {
    // Chrome/Edge
    case 'Chrome':
      return api.tabOpenLink('chrome://settings/')
      // return newOpenLink('chrome://settings', { newTab: true })()
    // Firefox
    // case 'Firefox':
      // return api.tabOpenLink('about:preferences')
      // return newOpenLink('about:preferences', { newTab: true })()
    default:
      // do nothing
      // api.Front.showBanner('Unsupported browser')
      return
  }
  browser.runtime
}

