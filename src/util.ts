
// https://github.com/brookhong/Surfingkeys/blob/master/src/content_scripts/ui/frontend.js
export enum SurfingkeysUsage {
  Help = 0,
  MouseClick = 1,
  Scroll = 2,
  Tabs = 3,
  PageNav = 4,
  Sessions = 5,
  SearchSelectedWith = 6,
  Clipboard = 7,
  Omnibar = 8,
  VisualMode = 9,
  VimMarks = 10,
  Settings = 11,
  ChromeURLs = 12,
  Proxy = 13,
  Misc = 14,
  InsertMode = 15,
}

export const locale = typeof navigator !== 'undefined' ? navigator.language : ''

export function escape(str: string): string {
  return String(str).replace(/[&<>"'`=/]/g, (s: string): string => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;',
  }[s] || s))
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#Escaping
export function escapeRegExp(str: string): string {
  return str.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&')
}

export function urlPath(count = 0, domain = false) {
  let path = window.location.pathname.slice(1)
  if (count) {
    path = path.split('/').slice(0, count).join('/')
  }
  if (domain) {
    path = window.location.host + '/' + path
  }
  return path
}

// export async function getConfigItem(key: string, defaultValue = ''): Promise<string> {
//   const fullKey = `surfingkeys.config.${key}`
//   const { [fullKey]: value } = await storage.local.get({ [fullKey]: defaultValue })
//   return value
// }

// export function setConfigItem(key: string, value: string): Promise<void> {
//   const fullKey = `surfingkeys.config.${key}`
//   return storage.local.set({ [fullKey]: value })
// }

// export async function getConfig(key: string, defaultValue?: string): Promise<string> {
//   const value = await getConfigItem(key, defaultValue)
//   return `${key}=${value}`
// }

// export function setConfig(str: string): Promise<void> {
//   const [key, ...values] = str.split('=')
//   const value = values.join('=')
//   return setConfigItem(key.trim(), value.trim())
// }

export const browserName = api.getBrowserName()
export function isBrowser(name: string): boolean {
  return browserName == name
}

export function isGlobalDomain(domain: string): boolean {
  return domain === '*'
}

// export async function getWebpageMeta(url: string)  {
//   const html  = await fetch(`http://proxy.owldevs.id/proxy/${url}`).then(resp => resp.text())
//   const doc = new DOMParser().parseFromString(html, 'text/html')
//   const title = doc.querySelectorAll('title')[0]?.innerText
//   const description = doc.querySelectorAll('meta[name="description"]')[0]?.getAttribute('content')
//   return {
//     title,
//     description,
//   }
// }

export function isRectVisibleInViewport(rect: DOMRect): boolean {
  return (
    rect.width > 0 &&
    rect.height > 0 &&
    rect.bottom >= 0 &&
    rect.right >= 0 &&
    rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.left <= (window.innerWidth || document.documentElement.clientWidth)
  )
}

export function isElementInViewport(el: HTMLElement): boolean {
  return el.offsetHeight > 0 &&
    el.offsetWidth > 0 &&
    !el.getAttribute('disabled') &&
    isRectVisibleInViewport(el.getBoundingClientRect())
}

export function createSuggestionItem(html: string, props = {}) {
  const li = document.createElement('li')
  li.innerHTML = html
  return { html: li.outerHTML, props }
}

export function createURLItem(title: string, url: string, sanitize = true)  {
  let t = title
  let u = url
  if (sanitize) {
    t = escape(t)
    u = new URL(u).toString()
  }
  return createSuggestionItem(`
      <div class="title">${t}</div>
      <div class="url">${u}</div>
    `, { url: u })
}

/**
 * Create hints for the given selector
 * @param selector <string> - selector to create hints for
 * @param action <api.Hints.OnHintKey> - action to execute on hint click
 * @returns <function> - function to create hints
 */
export function createHints(selector: string, action?: api.Hints.OnHintKey) {
  return () => {
    if (typeof action === 'undefined') {
      action = api.Hints.dispatchMouseClick
    }
    return api.Hints.create(selector, action)
  }
}

export function createHintsWithFilter(
  filter: (element: Element) => boolean,
  selector = 'a[href]', action?: api.Hints.OnHintKey,
) {
  return () => {
    if (typeof action === 'undefined') {
      action = api.Hints.dispatchMouseClick
    }
    const elements = Array.from(document.querySelectorAll(selector)).filter(filter)
    return api.Hints.create(elements, action)
  }
}

// Process Unmaps
export const rmMaps = (keys: string[]) => {
  keys.forEach((u) => api.unmap(u))
}

export const rmSearchAliases = (a: { [k: string]: string[] }) => {
  Object.entries(a).forEach(([leader, items]) => {
    items.forEach((v) => api.removeSearchAlias(v, leader))
  })
}

export function loadKeys(siteleader: string, site: Site) {
  const { domains: siteDomains, keys } = site
  if (!keys) { return }

  for (const key of keys.filter(k => !k.invalid)) {
    const {
      alias, map, replace, callback,
      domains = siteDomains,
      category = SurfingkeysUsage.Misc,
      description = '',
    } = key
    const opts: api.MapkeyOptions = {}

    for (const domain of domains) {
      let leader = ''
      if (!isGlobalDomain(domain)) {
        const d = domain.replace('.', '\\.')
        opts.domain = new RegExp(`^http(s)?://(([a-zA-Z0-9-_]+\\.)*)(${d})(/.*)?`)
        leader = siteleader
      }

      if (map) {
        replace && api.unmap(map)
        // api.unmap(alias)
        api.map(alias, map)
      } else {
        const keystroke = `${leader}${alias}`
        const fullDescription = `#${category}◆ ${description}`
        // api.unmap(keystroke, opts.domain)
        api.mapkey(keystroke, fullDescription, callback, opts)
      }
    }
  }
}

// Process searches
export function loadSearches(searchleader: string, site: Site) {
  const { prefix = '', searches } = site
  if (!searches) { return }

  if (prefix) {
    api.unmap(`${searchleader}${prefix}`)
  }

  const searchEntries =  Object.entries(searches).filter(([, v]) => !v.invalid)
  for (const [k, v] of searchEntries) {
    const { name, alias = k, search, suggest, callback } = v
    const searchAlias = `${prefix}${alias}`
    api.addSearchAlias(searchAlias, name, search, searchleader, suggest, callback)

    // api.unmap(`${searchleader}${searchAlias}`)
    api.mapkey(`${searchleader}${searchAlias}`, `#8◆ Search ${name}`, () => {
      api.Front.openOmnibar({ type: 'SearchEngine', extra: searchAlias })
    })

    // api.unmap(`c${searchleader}${searchAlias}`)
    api.mapkey(`c${searchleader}${searchAlias}`, `#8◆ Search ${name} with clipboard contents`, () => {
      api.Clipboard.read(({ data }) => {
        api.Front.openOmnibar({ type: 'SearchEngine', pref: data, extra: searchAlias })
      })
    })
  }
}

// export function loadStyles(site: Site) {
//   const { domains, styles } = site
//   if (!styles) { return }

//   const appendStyle = domains.some(domain => {
//     if (isGlobalDomain(domain)) { return true }
//     const d = domain.replace('.', '\\.')
//     const dre = new RegExp(`^http(s)?://(([a-zA-Z0-9-_]+\\.)*)(${d})(/.*)?`)
//     return dre.test(window.location.href)
//   })

//   if (appendStyle) {
//     chrome.tabs.insertCSS({ code: styles })
// //     const js = `
// // const styles = \`
// // ${styles}
// // \`
// // const head = document.head || document.getElementsByTagName('head')[0]
// // const style = document.createElement('style')
// // head.appendChild(style)
// // style.appendChild(document.createTextNode(styles))
// //     `
// //     api.insertJS(js)
//   }
// }
