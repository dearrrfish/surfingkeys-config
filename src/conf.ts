
import {
  loadKeys,
  loadSearches,
  // loadStyles,
  rmMaps, rmSearchAliases,
} from './util'
import sites from './sites'

// ---- Settings ----//
Object.assign(settings, {
  hintAlign: 'left',
  omnibarSuggestionTimeout: 500,
  richHintsForKeystroke: 1,
  defaultSearchEngine: 'dd',
  theme: `
    body {
      font-family: "DejaVu Sans", DejaVu, Arial, sans-serif;
    }
    /* Disable RichHints CSS animation */
    .expandRichHints {
        animation: 0s ease-in-out 1 forwards expandRichHints;
    }
    .collapseRichHints {
        animation: 0s ease-in-out 1 forwards collapseRichHints;
    }
  `,
})

api.Hints.characters = 'qwertasdfgzxcvb'

export const siteleader = '<Space>'
export const searchleader = 'a'

const unmaps = {
  mappings: [
    'sb', 'sw', 'ob',
    'ow', 'cp', ';cp',
    ';ap', 'spa', 'spb',
    'spd', 'sps', 'spc',
    'spi', 'sfr', 'zQ',
    'zz', 'zR',
    'Q', 'q',
    ';s', 'yp',
    '<Ctrl-j>', '<Ctrl-h>',
  ],
  searchAliases: {
    s: ['g', 'd', 'b',
      'w', 's', 'h'],
  },
}

rmMaps(unmaps.mappings)
rmSearchAliases(unmaps.searchAliases)

Object.values(sites).forEach(site => {
  // loadStyles(site)
  loadKeys(siteleader, site)
  loadSearches(searchleader, site)
})
