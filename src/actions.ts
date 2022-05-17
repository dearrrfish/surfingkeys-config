
import { urlPath, createHints } from './util'


/* Genreal site actions */

export function newCopyURLPath({ count = 0, domain = false } = {}) {
  return () => {
    api.Clipboard.write(urlPath(count, domain))
  }
}

export const copyImageURL = createHints('img', (img) => {
  const src = img && img.getAttribute('src')
  src && api.Clipboard.write(src)
})

export function copyOrgLink() {
  api.Clipboard.write(`[[${window.location.href}][${document.title}]]`)
}

export function copyMarkdownLink() {
  api.Clipboard.write(`[${document.title.replace('|', '\\|')}](${window.location.href})`)
}

export function newOpenLink(url: string, { newTab = false, active = true } = {}) {
  return () => {
    if (!url) return
    if (newTab) {
      api.RUNTIME('openLink', { tab: { tabbed: true, active }, url })
      return
    }
    window.location.assign(url)
  }
}

export function newOpenImage({ newTab = false, active = true } = {}) {
  return () => createHints('img', (img) => {
    const src = img && img.getAttribute('src')
    src && newOpenLink(src, { newTab, active })()
  })
}

export function newClickElement(selector: string) {
  return () => {
    const elem = document.querySelector(selector)
    elem instanceof HTMLElement && elem.click()
  }
}

export function newFakeSpot(url: string = window.location.href) {
  return newOpenLink(`https://fakespot.com/analyze?ra=true&url=${url}`, { newTab: true })
}