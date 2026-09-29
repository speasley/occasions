export interface OccasionsOptions {
  /** Custom occasions, e.g. { "Feb 27": "birthday", "_lastWeekday(Fri,May)": "book-club" }. These take priority over built-in ones. */
  occasions?: Record<string, string>
  /** Simulate a date, e.g. "Apr 01". For testing only. */
  date?: string
  /** Log all available occasions to the console. */
  log?: boolean
  /** Element to tag. Defaults to document.body. */
  target?: HTMLElement
  /** Called with the occasion name when one is found. */
  onOccasion?: (occasion: string) => void
}

/** Finds today's occasion and tags the target element with a class and data-occasion attribute. Returns the occasion name, if any. */
export declare function occasions(options?: OccasionsOptions): string | undefined

/** Returns today's occasion name, if any, without touching the DOM. */
export declare function getOccasion(options?: Omit<OccasionsOptions, "target" | "onOccasion" | "log">): string | undefined

export default occasions
