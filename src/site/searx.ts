import { searx } from '../conf.priv'

export const name = 'SearX'
export const prefix = 's'
export const {
  domains = ['searx.be'],
  searchUrl = 'https://searx.be/?q=',
} = searx || {}

export const searches: { [k: string]: SiteSearch }  = {
  '<Space>': {
    name: 'SearX Search',
    search: searchUrl,
  },
}