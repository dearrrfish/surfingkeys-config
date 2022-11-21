import { newClickElement } from '../actions'
import { SurfingkeysUsage } from '../util'

export const name = 'Bilibili'
export const domains = ['bilibili.com']
export const prefix = 'bv'

export const keys: SiteKey[] = [
  {
    alias: 'f',
    description: 'Toggle video windowed fullscreen.',
    category: SurfingkeysUsage.Misc,
    callback: newClickElement('.bpx-player-ctrl-btn.bpx-player-ctrl-web'),
  },
  {
    alias: 'F',
    description: 'Toggle video fullscreen.',
    category: SurfingkeysUsage.Misc,
    callback: newClickElement('.bpx-player-ctrl-btn.bpx-player-ctrl-full"'),
  },
  {
    alias: 'l',
    description: 'Like the video.',
    category: SurfingkeysUsage.Misc,
    callback: newClickElement('#arc_toolbar_report .like'),
  },
  {
    alias: 'c',
    description: 'Send coins.',
    category: SurfingkeysUsage.Misc,
    callback: newClickElement('#arc_toolbar_report .coin'),
  },
  {
    alias: 'b',
    description: 'Bookmark the video.',
    category: SurfingkeysUsage.Misc,
    callback: newClickElement('#arc_toolbar_report .collect'),
  },
]
