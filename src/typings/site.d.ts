
interface Site {
  name: string
  domains: string[]
  prefix?: string
  keys?: SiteKey[]
  searches?: { [k: string]: SiteSearch }
  styles?: string
}

interface SiteKey {
  alias: string;
  map?: string;
  domains?: string[];
  replace?: boolean;
  category?: number;
  description?: string;
  callback?: api.MapkeyJscode;
  invalid?: boolean | ((site?: Site) => boolean)
}

interface SiteSearch {
  name: string;
  alias?: string;
  search: string;
  suggest?: string;
  callback?: api.addSearchAliasCallbackToParseSuggestion;
  invalid?: boolean | ((site?: Site) => boolean)
}
