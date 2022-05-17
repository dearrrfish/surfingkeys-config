/* eslint-disable @typescript-eslint/no-explicit-any */

declare const settings: SurfingkeysSettings & typeof globalThis

// TODO - fill properties
interface SurfingkeysSettings { [k: string]: any }

type SurfingkeysCallback = (...args: any[]) => any | void

declare namespace api {
  interface MapkeyOptions {
    domain?: RegExp
    repeatIgnore?: boolean
  }
  type MapkeyJscode = (next_pressed?: string) => any | void
  type RUNTIMEOnload = (response?: XMLHttpRequestResponseType) => any | void

  export function RUNTIME(action: string, args?: object, onload?: RUNTIMEOnload)
  export function insertJS(code: string | function, onload?: function)
  export function unmap(keystroke: string, domain?: RegExp)
  export function map(new_keystroke: string, old_keystroke: string, domain?: RegExp, new_annotation?: string)
  export function mapkey(keys: string, annotation: string, jscode?: MapkeyJscode, options?: MapKeyOptions)

  /**
   * Add a search engine alias into Omnibar.
   * @param alias <string> - the key to trigger this search engine, one or several chars, used as search alias, when you input the string and press space in omnibar, the search engine will be triggered
   * @param prompt <string> - the prompt to show in omnibar
   * @param search_url <string> - the URL of the search engine, for example, `https://www.s.com/search.html?query=`, if there are extra parameters for the search engine, you can use it as `https://www.s.com/search.html?query={0}&type=cs` or `https://www.s.com/search.html?type=cs&query=`(since order of URL parameters usually does not matter).
   * @param search_leader_key <string, optional> - `<search_leader_key><alias>` in normal mode will search selected text with this search engine directly without opening the omnibar, for example `sd`. (optional, default `s`)
   * @param suggestion_url <string, optional> - the URL to fetch suggestions in omnibar when this search engine is triggered. (optional, default `null`)
   * @param callback_to_parse_suggestion <function, optional> - Callback function to parse the response from `suggestion_url` and return a list of strings as suggestions. (optional, default `null`)
   * @param only_this_site_key <string, optional> - `<search_leader_key><only_this_site_key><alias>` in normal mode will search selected text within current site with this search engine directly without opening the omnibar, for example `sod`. (optional, default `o`)
   * @param options <object> - `favicon_url` URL for favicon for this search engine (optional, default `null`)
   */
  export function addSearchAlias(
    alias: string, prompt: string, search_url: string, search_leader_key?: string = 's', suggestion_url?: string,
    callback_to_parse_suggestion?: addSearchAliasCallbackToParseSuggestion,
    only_this_site_key?: string = 'o', options?: { favicon_url: string }
  )
  /**
   * Callback function to parse the response from `suggestion_url` and return a list of strings as suggestions.
   * @param response <object> - an object containing a property `text` which holds the text of the response.
   * @param request <object> - an object containing the properties `query` which is the text of the query and `url` which is the formatted URL for the request.
   * @returns <string[]> - list of strings as suggestions.
   */
  type addSearchAliasCallbackToParseSuggestion = (response: { text: string }, request: { query: string, url: string }) => string[]


  export function removeSearchAlias(alias: string, search_leader_key?: string = 's', only_this_site_key?: string = 'o')
  export function tabOpenLink(str:string, simultaneousness?: number = 5)
  export function getBrowserName(): string
}

declare namespace api.Clipboard {
  export function read(onReady: (response: { data: any }) => void)
  export function write(text: string)
}

declare namespace api.Front {
  /**
   *
   * @param args <object> - arguments object
   * @param args.type <string> - the sub type for the omnibar, which can be Bookmarks, AddBookmark, History, URLs, RecentlyClosed, TabURLs, Tabs, Windows, VIMarks, SearchEngine, Commands, OmniQuery and UserURLs
   * @param args.extras <any, optional> - extra arguments for the omnibar callback
   * @example
   * mapkey('ou', '#8Open AWS services', function() {
        var services = Array.from(top.document.querySelectorAll('#awsc-services-container li[data-service-href]')).map(function(li) {
            return {
                title: li.querySelector("span.service-label").textContent,
                url: li.getAttribute('data-service-href')
            };
        });
        if (services.length === 0) {
            services = Array.from(top.document.querySelectorAll('div[data-testid="awsc-nav-service-list"] li[data-testid]>a')).map(function(a) {
                return {
                    title: a.innerText,
                    url: a.href
                };
            });
        }
        Front.openOmnibar({type: "UserURLs", extra: services});
    }, {domain: /console.amazonaws|console.aws.amazon.com/i});
   */
  export function openOmnibar(args: {
    type: 'Bookmarks'| 'AddBookmark'| 'History'| 'URLs'| 'RecentlyClosed'| 'TabURLs'| 'Tabs'| 'Windows'| 'VIMarks'| 'SearchEngine'| 'Commands'| 'OmniQuery' |'UserURLs',
    pref?: string,
    extra?: any
  })

  /**
   * Launch the vim editor
   * @param element <HTMLElement | string> - the target element which the vim editor is launched for, this parameter can also be a string, which will be used as default content in vim editor.
   * @param onWrite <function> - a callback function to be executed on written back from vim editor.
   * @param type <string, optional> - the type for the vim editor, which can be url, if not provided, it will be tag name of the target element. (optional, default null)
   * @param useNeovim <boolean, optional> - the vim editor will be the embeded JS implementation, if `useNeovim` is true, neovim will be used through natvie messaging. (optional, default false)
   * @example
   * mapkey(';U', '#4Edit current URL with vim editor, and reload', function() {
        Front.showEditor(window.location.href, function(data) {
            window.location.href = data;
        }, 'url');
    });
   */
  export function showEditor(
    element: HTMLElement | string,
    onWrite: SurfingkeysCallback,
    type?: string | null = null,
    useNeovim?: boolean = false
  ): void

  /**
   * Show message in banner.
   * @param msg <string> - the message to be displayed in banner
   * @param timeout <number, optional> - milliseconds after which the banner will disappear. (optional, default 1600)
   * @example Front.showBanner(window.location.href);
   */
  export function showBanner(msg: string, timeout?: number = 1600)

  /**
   * Show message in popup.
   * @param msg <string> - the message to be displayed in popup
   * @example Front.showPopup(window.location.href);
   */
  export function showPopup(msg: string): void
}

declare namespace api.Hints {
  export type OnHintKey = string | ((element?: Element, event?: Event) => void) | null

  export let characters: string
  export function create(selector: string | Element[], callback?: OnHintKey): boolean
  export const dispatchMouseClick: OnHintKey
}

