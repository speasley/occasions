import * as core from "./core/index"
import occasionsData from "./occasions.json"

const consolePre = "[occasions]"

// use options-supplied date, or today's date
const resolveDate = (options) => options.date ? core.todaysDate(options.date).slice(0, 6) : core.todaysDate()

// merge any user-supplied occasions and resolve special dates for the given date
const resolveOccasions = (userOccasions = {}, date) => {
  let occasions = core.mergeHashes({ ...occasionsData }, userOccasions)
  Object.keys(occasions).forEach(key => {
    if (key.slice(0, 1) === "_") {
      // replace key with special-date result
      occasions = core.renameKey(occasions, key, core.specialDate(key, date))
    }
  })
  return occasions
}

const logOccasions = (occasions) => {
  const sortedDates = Object.keys(occasions).sort((a, b) => new Date(`2000 ${a}`) - new Date(`2000 ${b}`))
  console.groupCollapsed(`${consolePre} available occasions...`)
  sortedDates.forEach(date => console.log(`${date}: ${occasions[date]}`))
  console.groupEnd()
}

const tag = (target, occasion) => {
  target.classList.add(occasion)
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
  if (options.log) logOccasions(available)

  const occasion = available[date]
  if (occasion === undefined) {
    console.debug(`${consolePre} no occasion found for today.`)
    return undefined
  }
  console.debug(`${consolePre} "${occasion}" occasion found.`)

  const apply = (target) => {
    if (target) tag(target, occasion)
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
