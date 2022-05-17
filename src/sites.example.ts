
import {
  name as globalName,
  domains as globalDomains,
  keys as globalKeys,
  // keysChrome as globalKeysChrome,
} from './site/global'
import * as github from './site/github'
import * as pinboard from './site/pinboard'
import * as searx from './site/searx'
import * as sspai from './site/sspai'
import * as bilibili from './site/bilibili'
import * as amazon from './site/amazon'
import * as youtube from './site/youtube'
import * as twitter from './site/twitter'

export default {
  global: {
    name: globalName,
    domains: globalDomains,
    keys: [
      ...globalKeys,
      // ...globalKeysChrome,
    ],
  },
  amazon,
  bilibili,
  github,
  pinboard,
  searx,
  sspai,
  twitter,
  youtube,
}