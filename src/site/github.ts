import { createURLItem } from '../util'

import { check as checkReservedName } from 'github-reserved-names'
// import { createHintsWithFilter } from '../util'
import { github } from '../conf.priv'
import { newOpenLink } from '../actions'

const { user, projectId = 1 } = github

export const name = 'Github'
export const domains = ['github.com']
export const prefix = 'gh'

export const keys: SiteKey[] = [
  // Global keys
  {
    alias:       'ghp',
    domains:     ['*'],
    description: 'Open Github project (1)',
    callback:    newOpenLink(`https://github.com/users/${user}/projects/${projectId}`),
    invalid:     !user,
  },

  // Site specific keys
  {
    alias:       'A',
    description: 'Open repository Actions page',
    callback:    newOpenRepoPage('/actions'),
  },
  {
    alias:       'C',
    description: 'Open repository Commits page',
    callback:    newOpenRepoPage('/commits'),
  },
  {
    alias:       'I',
    description: 'Open repository Issues page',
    callback:    newOpenRepoPage('/issues'),
  },
  {
    alias:       'P',
    description: 'Open repository Pull Requests page',
    callback:    newOpenRepoPage('/pulls'),
  },
  {
    alias:       'R',
    description: 'Open repository page',
    callback:    newOpenRepoPage('/'),
  },
  {
    alias:       'S',
    description: 'Open repository Settings page',
    callback:    newOpenRepoPage('/settings'),
  },
  {
    alias:       'W',
    description: 'Open repository Wiki page',
    callback:    newOpenRepoPage('/wiki'),
  },
  {
    alias:       'X',
    description: 'Open repository Security page',
    callback:    newOpenRepoPage('/security'),
  },
  // {
  //   alias:       'O',
  //   description: 'Open repository Owner\'s profile page',
  //   callback:    openRepoOwner,
  // },
  // {
  //   alias:       'M',
  //   description: 'Open your profile page (\'Me\')',
  //   callback:    openProfile,
  // },
  // {
  //   alias:       'a',
  //   description: 'View Repository',
  //   callback:    openRepo,
  // },
  // {
  //   alias:       'u',
  //   description: 'View User',
  //   callback:    openUser,
  // },
  // {
  //   alias:       'f',
  //   description: 'View File',
  //   callback:    openFile,
  // },
  // {
  //   alias:       'c',
  //   description: 'View Commit',
  //   callback:    openCommit,
  // },
  // {
  //   alias:       'i',
  //   description: 'View Issue',
  //   callback:    openIssue,
  // },
  // {
  //   alias:       'p',
  //   description: 'View Pull Request',
  //   callback:    openPull,
  // },
  // {
  //   alias:       'e',
  //   description: 'View external link',
  //   callback:    createHints('a[rel=nofollow]'),
  // },
  // { // TODO: Add repetition support: 3gu
  //   leader:      '',
  //   alias:       'gu',
  //   description: 'Go up one path in the URL (GitHub)',
  //   callback:    goParent,
  // },
  // {
  //   alias:       's',
  //   description: 'Toggle Star',
  //   callback:    star({ toggle: true }),
  // },
  // {
  //   alias:       'y',
  //   description: 'Copy Project Path',
  //   callback:    copyURLPath({ count: 2 }),
  // },
  // {
  //   alias:       'Y',
  //   description: 'Copy Project Path (including domain)',
  //   callback:    copyURLPath({ count: 2, domain: true }),
  // },
  // {
  //   alias:       'l',
  //   description: 'Toggle repo language stats',
  //   callback:    toggleLangStats,
  // },
  // {
  //   alias:       'D',
  //   description: 'View GoDoc for Project',
  //   callback:    viewGodoc,
  // },
  // {
  //   alias:       'G',
  //   description: 'View on SourceGraph',
  //   callback:    viewSourceGraph,
  // },
  // {
  //   alias:       'ra',
  //   description: 'View live raw version of file',
  //   callback:    viewRaw,
  // },
  // {
  //   alias:       'gcp',
  //   description: 'Open clipboard string as file path in repo',
  //   callback:    openFileFromClipboard,
  // },
]

export const searches: { [k: string]: SiteSearch } = {
  '<Space>': {
    name: 'Github Search',
    search: 'https://github.com/search?q=',
    suggest: 'https://api.github.com/search/repositories?sort=stars&order=desc&q=',
    callback: function(response) {
      return JSON.parse(response.text).items.map((s: GenericObject) => {
        let prefix = ''
        if (s.stargazers_count) {
          prefix += `[★${s.stargazers_count}] `
        }
        return createURLItem(`${prefix}${s.full_name}`, `${s.html_url}`)
      })
    },
  },

  // select project (localStorage.setItem('surfingkeys.github.project', '<project_id>'))

  // open cards, filter by tag/status

  // add cards
}


function parseRepo(url: string | URL | null = window.location.href, rootOnly = false) {
  if (!url) { return null }
  const u = url instanceof URL ? url : new URL(url)
  const [user, repo, ...rest] = u.pathname.split('/').filter((s) => s !== '')
  const isRoot = rest.length === 0
  const cond = (
    u.origin === window.location.origin
    && typeof user === 'string'
    && user.length > 0
    && typeof repo === 'string'
    && repo.length > 0
    && (isRoot || rootOnly === false)
    && /^([a-zA-Z0-9]+-?)+$/.test(user)
    && !checkReservedName(user)
  )
  return cond
    ? {
      type:     'repo',
      user,
      repo,
      owner:    user,
      name:     repo,
      href:     url,
      url:      u,
      repoBase: `/${user}/${repo}`,
      repoRoot: isRoot,
      repoPath: rest,
    }
    : null
}

// function isRepo(url: string | null = window.location.href, rootOnly = true) {
//   return parseRepo(url, rootOnly) !== null
// }

// function openRepo() {
//   return createHintsWithFilter((a: Element) => { return isRepo(a.getAttribute('href')) })
// }

export function newOpenRepoFromClipboard({ newTab = true } = {}) {
  return () => {
    api.Clipboard.read(({ data }) => newOpenLink(`https://github.com/${data}`, { newTab }))
  }
}

export function newOpenRepoPage(repoPath: string) {
  return () => {
    const repo = parseRepo()
    if (repo === null) return
    newOpenLink(`${repo.repoBase}${repoPath}`)()
  }
}