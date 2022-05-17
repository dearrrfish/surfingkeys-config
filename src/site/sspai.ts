
export const name = 'Sspai'
export const domains = ['sspai.com']
export const prefix = 'ssp'

export const searches: { [k: string]: SiteSearch } = {
  '<Space>': {
    name: 'Sspai Search',
    search: 'https://sspai.com/search/post/',
  },
  't': {
    name: 'Sspai Tag',
    search: 'https://sspai.com/tag/',
  },
}
