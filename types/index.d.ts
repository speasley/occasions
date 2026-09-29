export interface OccasionsOptions {
  /** Occasions keyed by date, e.g. { "Feb 27": "birthday", "lastWeekday(Fri,May)": "book-club" }. Import "occasions/presets" for a built-in list. */
  occasions?: Record<string, string>
  /** Simulate a date, e.g. "Apr 01". For testing only. */
  date?: string
  /** Log all available occasions to the console. */
  log?: boolean
  /** ID of the element to tag, e.g. "app" or "#app". Defaults to document.body. */
  element?: string
  /** Element to tag. Takes priority over `element`. Defaults to document.body. */
  target?: HTMLElement
  /** Prefix for the class added to the element. Defaults to "occasion-". Use "" for no prefix. */
  prefix?: string
  /** Called with the occasion name when one is found. */
  onOccasion?: (occasion: string) => void
}

/** Finds today's occasion and tags the target element with a class and data-occasion attribute. Returns the occasion name, if any. */
export declare function occasions(options?: OccasionsOptions): string | undefined

/** Returns today's occasion name, if any, without touching the DOM. */
export declare function getOccasion(options?: Omit<OccasionsOptions, "element" | "target" | "prefix" | "onOccasion" | "log">): string | undefined

export default occasions
