import { createHints, SurfingkeysUsage } from '../util'

export const name = 'Gmail'
export const prefix = 'gm'

// only works for HTML view
export const domains = ['mail.google.com/mail/u/\\d+/h/\\w+/\\?&']

const Pages: { [k: string]: string[][] } = {
  INBOX: [[''], ['ARCHIVE', 'SPAM', 'TRASH'], ['READ', 'UNREAD', 'STAR', 'UNSTAR', 'MUTE']],
  THREAD_IN_INBOX: [['th=\\w+&v=c'], ['ARCHIVE', 'SPAM', 'TRASH'], ['READ', 'UNREAD', 'STAR', 'UNSTAR', 'MUTE']],
  STARRED: [['s=r'], ['UNSTAR', 'SPAM'], ['ARCHIVE', 'INBOX', 'READ', 'UNREAD', 'TRASH', 'MUTE']],
  SENT_MAIL: [['s=s'], [], ['INBOX', 'READ', 'UNREAD', 'STAR', 'UNSTAR', 'TRASH', 'MUTE']],
  DRAFTS: [['s=d'], ['DISCARD'], ['INBOX', 'READ', 'UNREAD', 'STAR', 'UNSTAR']],
  ALL_MAIL: [['s=a'], ['INBOX', 'SPAM', 'TRASH'], ['ARCHIVE', 'READ', 'UNREAD', 'STAR', 'UNSTAR']],
  SPAM: [['s=m'], ['PURGE', 'UNSPAM'], ['READ', 'UNREAD', 'STAR', 'UNSTAR']],
  TRASH: [['s=t'], ['PURGE', 'INBOX'], ['READ', 'UNREAD', 'STAR', 'UNSTAR', 'SPAM']],
  SEARCH: [['s=q'], ['SPAM', 'TRASH'], ['ARCHIVE', 'READ', 'UNREAD', 'STAR', 'UNSTAR']],
  THREAD_IN_SEARCH: [['th=', 's=q'], ['SPAM', 'TRASH'], ['ARCHIVE', 'READ', 'UNREAD', 'STAR', 'UNSTAR']],
  CONTACTS: [['v=cl'], ['COMPOSE_CONTACTS', 'DEL_CONTACTS']],
  COMPOSE_MAIL: [['cs=b&pv=tl&v=b']],
  SEARCH_OPTIONS: [['pv=tl&v=as']],
  CREATE_FILTER: [['pv=tl&v=caf']],
  SETTINGS: [['v=prg']],
}

const PageNavRE: {[k: string]: RegExp} = {
  NEWER: /newer/i,
  OLDER: /older/i,
  REFRESH: /refresh/i,
  BACK: /back to/i,
}

const Actions: { [k: string]: string[] } = {
  ARCHIVE: ['nvp_a_arch', 'arch'],
  INBOX: ['nvp_a_ib', 'ib'],
  SPAM: ['nvp_a_sp', 'sp'],
  UNSPAM: ['nvp_a_us', ''],
  TRASH: ['nvp_a_tr', 'tr'],
  PURGE: ['nvp_a_dl', ''],
  DISCARD: ['nvp_a_dd', ''],
  READ: ['', 'rd'],
  UNREAD: ['', 'ur'],
  STAR: ['', 'st'],
  UNSTAR: ['nvp_bu_rs', 'xst'],
  MUTE: ['', 'ig'],
  GO: ['nvp_tbu_go'],
  TOGGLE_STAR: ['', ''],
  DELETE: ['', ''],
}


const __colors = {
  read: '#e8eef7',
  unread: '#ffffff',
}

export const styles = `
form[name="f"] > table:nth-of-type(2) tr:focus > td {
  border: 1px solid black;
}
`

export const keys: SiteKey[]  = [
  // Implementing official keyboard shortcuts https://support.google.com/mail/answer/6594
  // Actions
  {
    alias: 'e',
    description: 'Archive.',
    category: SurfingkeysUsage.MouseClick,
    callback: () => goAction('ARCHIVE'),
  },
  {
    alias: 's',
    description: 'Toggle star.',
    category: SurfingkeysUsage.MouseClick,
    callback: () => goAction('TOGGLE_STAR'),
  },
  {
    alias: 'I', // shift+i
    description: 'Mark as read.',
    category: SurfingkeysUsage.MouseClick,
    callback: () => goAction('READ'),
  },
  {
    alias: 'U', // shift+u
    description: 'Mark as unread.',
    category: SurfingkeysUsage.MouseClick,
    callback: () => goAction('UNREAD'),
  },
  {
    alias: '_',
    description: 'Mute conversation.',
    category: SurfingkeysUsage.MouseClick,
    callback: () => goAction('MUTE'),
  },
  {
    alias: '!',
    description: 'Report as spam.',
    category: SurfingkeysUsage.MouseClick,
    callback: () => goAction('SPAM'),
  },
  {
    alias: '#',
    description: 'Delete.',
    category: SurfingkeysUsage.MouseClick,
    callback: () => goAction('DELETE'),
  },
  // Jumping
  {
    alias: 'gi',
    description: 'Go to Inbox.',
    category: SurfingkeysUsage.PageNav,
    callback: () => goTo('INBOX'),
  },
  {
    alias: 'gs',
    description: 'Go to Starred conversations.',
    category: SurfingkeysUsage.PageNav,
    callback: () => goTo('STARRED'),
  },
  {
    alias: 'gt',
    description: 'Go to sent messages.',
    category: SurfingkeysUsage.PageNav,
    callback: () => goTo('SENT_MAIL'),
  },
  {
    alias: 'gd',
    description: 'Go to Drafts.',
    category: SurfingkeysUsage.PageNav,
    callback: () => goTo('DRAFTS'),
  },
  {
    alias: 'ga',
    description: 'Go to All mail.',
    category: SurfingkeysUsage.PageNav,
    callback: () => goTo('ALL_MAIL'),
  },
  {
    alias: 'gM',
    description: 'Go to Spam.',
    category: SurfingkeysUsage.PageNav,
    callback: () => goTo('SPAM'),
  },
  {
    alias: 'gT',
    description: 'Go to Trash.',
    category: SurfingkeysUsage.PageNav,
    callback: () => goTo('TRASH'),
  },
  {
    alias: 'gC',
    description: 'Go to Contacts.',
    category: SurfingkeysUsage.PageNav,
    callback: () => goTo('STARRED'),
  },
  {
    alias: 'gS',
    description: 'Search with options.',
    category: SurfingkeysUsage.PageNav,
    callback: () => goTo('SEARCH_OPTIONS'),
  },
  {
    alias: 'gF',
    description: 'Create a filter.',
    category: SurfingkeysUsage.PageNav,
    callback: () => goTo('CREATE_FILTER'),
  },
  {
    alias: 'g,',
    description: 'Go to Settings.',
    category: SurfingkeysUsage.PageNav,
    callback: () => goTo('SETTINGS'),
  },
  // Threadlist selection
  {
    alias: '*a',
    description: 'Select all conversations.',
    category: SurfingkeysUsage.MouseClick,
    callback: () => selectAll('SELECT'),
  },
  {
    alias: '*n',
    description: 'Deselect all conversations.',
    category: SurfingkeysUsage.MouseClick,
    callback: () => selectAll('DESELECT'),
  },
  {
    alias: '*r',
    description: 'Select read conversations.',
    category: SurfingkeysUsage.MouseClick,
    callback: () => selectAll('READ'),
  },
  {
    alias: '*u',
    description: 'Select unread conversations.',
    category: SurfingkeysUsage.MouseClick,
    callback: () => selectAll('UNREAD'),
  },
  {
    alias: '*s',
    description: 'Select starred conversations.',
    category: SurfingkeysUsage.MouseClick,
    callback: () => selectAll('STARRED'),
  },
  {
    alias: '*t',
    description: 'Select unstarred conversations.',
    category: SurfingkeysUsage.MouseClick,
    callback: () => selectAll('UNSTARRED'),
  },
  {
    alias: '**',
    description: 'Toggle selected status of conversations.',
    category: SurfingkeysUsage.MouseClick,
    callback: () => selectAll('REVERSE'),
  },
  // Navigation
  {
    alias: 'j',
    description: 'Go to next page/conversation.',
    category: SurfingkeysUsage.MouseClick,
    callback: () => pageNav('OLDER'),
  },
  {
    alias: 'k',
    description: 'Go to previous page/conversation.',
    category: SurfingkeysUsage.MouseClick,
    callback: () => pageNav('NEWER'),
  },
  {
    alias: 'u',
    description: 'Back to threadlist.',
    category: SurfingkeysUsage.MouseClick,
    callback: () => pageNav('BACK'),
  },
  // Application
  {
    alias: 'c',
    description: 'Compose mail.',
    category: SurfingkeysUsage.PageNav,
    callback: () => goTo('COMPOSE_MAIL'),
  },

  // Customize
  {
    alias: 'a',
    description: 'Select a conversation.',
    category: SurfingkeysUsage.MouseClick,
    callback: createHints('form[name="f"] input[type="checkbox"]:not(:checked)'),
  },
  {
    alias: 'A',
    description: 'Unselect a conversation.',
    category: SurfingkeysUsage.MouseClick,
    callback: createHints('form[name="f"] input[type="checkbox"]:checked'),
  },
  {
    alias: '*I',
    description: 'Select conversations in Inbox.',
    category: SurfingkeysUsage.MouseClick,
    callback: () => selectAll('LABEL_INBOX'),
  },
  {
    alias: 'gl',
    description: 'Open a conversation.',
    category: SurfingkeysUsage.MouseClick,
    callback: createHints('table.l td.lb a[href*="?s=l&l="]'),
  },
  {
    alias: 'o',
    description: 'Open a conversation.',
    category: SurfingkeysUsage.MouseClick,
    callback: createHints('form[name="f"] a[href*="?&th="]'),
  },
  {
    alias: 'ff',
    description: 'Search by same sender.',
    category: SurfingkeysUsage.MouseClick,
    callback: createHints('form[name="f"] a[href*="?&th="]', (a) => {
      const from = (mailListItem(a as HTMLElement)?.querySelector('td:nth-child(2)')?.textContent || '')
        .replace(/\(\d+\)$/, '')
        .trim()
      from && search(`from:(${from})`)
    }),
  },
  {
    alias: 'fs',
    description: 'Edit & search by subject.',
    category: SurfingkeysUsage.MouseClick,
    callback: createHints('form[name="f"] a[href*="?&th="]', (a) => {
      api.Front.showEditor((a?.textContent || '').trim(), (s)  => {
        s && search(`subject:(${s})`)
      })
    }),
  },
  {
    alias: 'fe',
    description: 'Edit & search by syntax, e.g. in:Inbox from:google',
    category: SurfingkeysUsage.MouseClick,
    callback: () => {
      api.Front.showEditor('', (s)  => {
        s.trim() && search(s)
      })
    },
  },
]

function search(q: string | { [k: string]: string | boolean }) {
  let searchString = ''
  if (typeof q == 'string') {
    searchString = q
  } else {
    const searches = []
    q.in && searches.push(`in:(${q.in})`)
    q.from && searches.push(`from:(${q.from})`)
    q.to && searches.push(`to:(${q.to})`)
    q.subject && searches.push(`subject:(${q.subject})`)
    q.search && searches.push(q.search)
    q.not && searches.push(`-{${q.not}}`)
    q.attachment && searches.push('has:attachment')
    searchString = searches.join(' ')
  }
  if (searchString.trim()) {
    // window.location.search = `s=q&q=${encodeURIComponent(searchString)}&nvp_site_mail=Search%20Mail`
    const searchInput = document.querySelector('input#sbq')
    const searchButton = document.querySelector('input[name="nvp_site_mail"]')
    searchInput && ((searchInput as HTMLInputElement).value = searchString)
    searchButton && (searchButton as HTMLInputElement).click()
  }
}

function goTo(t: string) {
  t in Pages && window.location.replace(`?&${Pages[t][0][0]}`)
}

function selectAll(action = 'SELECT', checkboxes?: NodeListOf<HTMLInputElement>) {
  if (!checkboxes) {
    checkboxes = document.querySelectorAll('input[type="checkbox"]')
  }
  switch (action) {
    case 'SELECT':
      checkboxes.forEach(c => { c.checked = true })
      break
    case 'DESELECT':
      checkboxes.forEach(c => { c.checked = false })
      break
    case 'REVERSE':
      checkboxes.forEach(c => { c.checked = !c.checked })
      break
    case 'READ':
      checkboxes.forEach(c => { c.checked = !unreadItem(c) })
      break
    case 'UNREAD':
      checkboxes.forEach(c => { c.checked = unreadItem(c) })
      break
    case 'STARRED':
      checkboxes.forEach(c => { c.checked = starredItem(c) })
      break
    case 'UNSTARRED':
      checkboxes.forEach(c => { c.checked = !starredItem(c) })
      break
    case 'LABEL_INBOX':
      checkboxes.forEach(c => { c.checked = labeledItem(c, 'Inbox') })
      break
  }
}

function mailListItem(elem: HTMLElement | null): HTMLElement | null {
  while (elem) {
    if (elem.tagName.toLocaleLowerCase() == 'tr') {
      return elem
    }
    elem = elem.parentElement
  }
  return elem
}

function unreadItem(elem: HTMLElement | null): boolean {
  return !!(mailListItem(elem)?.getAttribute('bgcolor')?.toLowerCase() == __colors.unread)
}

function starredItem(elem: HTMLElement | null): boolean {
  return !!(mailListItem(elem)?.querySelector('img[alt="Starred"]'))
}

function labeledItem(elem: HTMLElement | null, label: string): boolean {
  const innerHtml = mailListItem(elem)?.querySelector('span.ts')?.innerHTML || ''
  const reLabel = new RegExp(`<font color="#006633">${label}</font>`, 'i')
  return reLabel.test(innerHtml)
}

function getActionBar() {
  // get top action bar
  const form = document.querySelector('form[name="f"]')
  if (!form) return
  return (form as HTMLFormElement).innerText.trim()
    ? form.querySelector('table')
    : form.parentElement
}

function pageNav(to: string) {
  const re = PageNavRE[to]
  if (!re) return

  const ab = getActionBar()
  if (!ab) return

  const as = ab.querySelectorAll('a')
  as.forEach(a => {
    if (re.test(a.innerText)) {
      a.click()
      return
    }
  })
}

function getPage() {
  const search = window.location.search
  let page = 'INBOX'
  const thread = search.indexOf('th=') != -1
  for (const p of Object.keys(Pages).filter(p => p !== 'INBOX')) {
    const ss = Pages[p][0]
    if (ss.some(s => search.indexOf(s) != -1)) {
      page = p
      return [page, thread]
    }
  }
  return [page, thread]
}

function goAction(action: string) {
  if (!Actions[action]) return

  const ab = getActionBar()
  if (!ab) return

  const [p, th] = getPage()
  const [, btns, opts] = Pages[p as string]

  if (action == 'DELETE') {
    action = ['TRASH', 'PURGE', 'DISCARD'].find(a => [...btns, ...opts].indexOf(a) != -1) || ''
    if (!action) return
  } else if (action == 'TOGGLE_STAR') {
    if (th) {
      const starred = ab.querySelector('img[alt="star"]')
      action = starred ? 'UNSTAR' : 'STAR'
    } else {
      const checked = document.querySelectorAll('input[type="checkbox"]:checked')
      if (!checked.length) return
      let numStarred = 0
      checked.forEach(c => { numStarred += (starredItem(c as HTMLInputElement) ? 1 : 0) })
      action = numStarred == checked.length ? 'UNSTAR' : 'STAR'
    }
  }

  if (btns.indexOf(action) != -1) {
    const av = Actions[action][0]
    if (!av) return
    const btn = ab.querySelector(`input[type="submit"][name="${av}"]`) as HTMLInputElement
    btn && btn.click()
  } else if (opts.indexOf(action) != -1) {
    const av = Actions[action][1]
    const sl = ab.querySelector('select[name="tact"') as HTMLSelectElement
    const go = ab.querySelector(`input[type="submit"][name="${Actions.GO[0]}"]`) as HTMLInputElement
    if (!sl || !go) return
    sl.value = av
    go.click()
  }
}