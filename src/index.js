import * as core from "./core/index"

const consolePre = "[occasions]"
const defaultPrefix = "occasion-"

// title-case the month and pad single-digit days so "sep 4", "Sep 4" and "Sep 04" all match the internal "Mmm DD" format
const normalizeDate = (date) => date
  .replace(/^([a-z]{3}) (\d{1,2})(?!\d)/i, (_, month, day) => `${month[0].toUpperCase()}${month.slice(1).toLowerCase()} ${day.padStart(2, "0")}`)
  .slice(0, 6)

// use options-supplied date, or today's date
const resolveDate = (options) => options.date ? normalizeDate(options.date) : core.todaysDate()

// copy user-supplied occasions and resolve special dates for the given date
const resolveOccasions = (userOccasions = {}, date) => {
  let occasions = core.mergeHashes({}, userOccasions)
  Object.keys(occasions).forEach(key => {
    // replace key with special-date result, or normalize a plain date
    occasions = core.renameKey(occasions, key, core.specialDate(key, date) ?? normalizeDate(key))
  })
  return occasions
}

const logOccasions = (occasions) => {
  const sortedDates = Object.keys(occasions).sort((a, b) => new Date(`2000 ${a}`) - new Date(`2000 ${b}`))
  console.groupCollapsed(`${consolePre} available occasions...`)
  sortedDates.forEach(date => console.log(`${date}: ${occasions[date]}`))
  console.groupEnd()
}

const tag = (target, occasion, prefix) => {
  target.classList.add(`${prefix}${occasion}`)
  target.dataset.occasion = occasion
}

// returns today's occasion name (or undefined) without touching the DOM
const getOccasion = (options = {}) => {
  const date = resolveDate(options)
  return resolveOccasions(options.occasions, date)[date]
}

// finds today's occasion and tags the target element (document.body by default, or the element with the given ID)
const occasions = (options = {}) => {
  const date = resolveDate(options)
  const available = resolveOccasions(options.occasions, date)
  if (Object.keys(available).length === 0) {
    console.debug(`${consolePre} no occasions provided. Pass your own with the "occasions" option, or import the built-in list from "occasions/presets".`)
  }
  if (options.log) logOccasions(available)

  const occasion = available[date]
  if (occasion === undefined) {
    console.debug(`${consolePre} no occasion found for today.`)
    return undefined
  }
  console.debug(`${consolePre} "${occasion}" occasion found.`)

  const apply = (target) => {
    if (target) tag(target, occasion, options.prefix ?? defaultPrefix)
    if (options.onOccasion) options.onOccasion(occasion)
  }

  if (options.target) {
    apply(options.target)
  } else if (typeof document === "undefined") {
    // no DOM (e.g. server-side rendering): nothing to tag
    apply(null)
  } else {
    // element option is an ID ("app" or "#app"); defaults to <body>
    const findElement = () => options.element
      ? document.getElementById(options.element.replace(/^#/, ""))
      : document.body
    const applyToElement = () => {
      const target = findElement()
      if (!target) console.warn(`${consolePre} no element found with id "${options.element}".`)
      apply(target)
    }
    if (findElement() || document.readyState !== "loading") {
      applyToElement()
    } else {
      // script loaded before the element: wait for the DOM
      document.addEventListener("DOMContentLoaded", applyToElement, { once: true })
    }
  }

  return occasion
}

export { occasions, getOccasion }
export default occasions
