import { newFakeSpot, newOpenLink } from '../actions'
import { createHints, isElementInViewport } from '../util'

export const name = 'Amazon'
export const domains = ['amazon.com']
export const prefix = 'az'

export const keys: SiteKey[] = [
  {
    alias: 'a',
    description: 'View product',
    callback: viewProduct,
  },
  {
    alias: 'c',
    description: 'Add to cart',
    callback: createHints('#add-to-cart-button'),
  },
    {
    alias:       'R',
    description: 'View Product Reviews',
    callback:    newOpenLink('#customerReviews'),
  },
  {
    alias:       'Q',
    description: 'View Product Q&A',
    callback:    newOpenLink('#Ask'),
  },
  {
    alias:       'A',
    description: 'Open Account page',
    callback:    newOpenLink('/gp/css/homepage.html'),
  },
  {
    alias:       'C',
    description: 'Open Cart page',
    callback:    newOpenLink('/gp/cart/view.html'),
  },
  {
    alias:       'O',
    description: 'Open Orders page',
    callback:    newOpenLink('/gp/css/order-history'),
  },
  {
    alias: 'fs',
    description: 'Fakespot',
    callback: newFakeSpot(),
  },
  {
    alias: 'ph',
    description: 'Price history',
    callback: newCamelcamelcamel(),
  },
]

function newCamelcamelcamel(url: string = window.location.href) {
  return newOpenLink(`https://camelcamelcamel.com/search?q=${url}`, { newTab: true })
}


function viewProduct() {
  const reHost = /^([-\w]+[.])*amazon.\w+$/
  const rePath = /^(?:.*\/)*(?:dp|gp\/product)(?:\/(\w{10})).*/
  const elements: { [k: string]: HTMLElement } = {}
  document.querySelectorAll('a[href]').forEach((a) => {
    if (!(a instanceof HTMLElement)) {
      return
    }

    const u = new URL(a.getAttribute('href') || '')
    if (u.hash.length === 0 && reHost.test(u.hostname)) {
      const rePathRes = rePath.exec(u.pathname)
      if (rePathRes === null || rePathRes.length !== 2) {
        return
      }
      if (!isElementInViewport(a)) {
        return
      }

      const asin = rePathRes[1]

      if (elements[asin] !== undefined) {
        if (!(elements[asin].innerText.trim().length === 0 && a.innerText.trim().length > 0)) {
          return
        }
      }

      elements[asin] = a
    }
  })

  return api.Hints.create(Object.values(elements), api.Hints.dispatchMouseClick)
}