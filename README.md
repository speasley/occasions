# occasions

Tags your HTML’s body element with a class and data attribute reflecting today’s occasion or holiday. You can then style that element with CSS or implement some JavaScript behaviour. For example, you could show special versions of your site’s logo on different holidays or trigger a holiday-specific modal.

Works anywhere: plain JavaScript, a `<script>` tag, React, Svelte, Astro, or any other framework. A Vue plugin is included.

[![Version](https://img.shields.io/npm/v/occasions?style=flat-square)](https://www.npmjs.com/package/occasions)
[![MIT License](https://img.shields.io/packagist/l/doctrine/orm.svg?style=flat-square)](https://www.npmjs.com/package/occasions)
[![Minified Size](https://img.shields.io/bundlephobia/min/occasions?color=%23F18F01&style=flat-square)](https://www.npmjs.com/package/occasions)

# Table of Contents
* [Installation](#installation)
* [Usage](#usage)
* [Options](#options)
* [Extras](#extras)
* [Examples](#examples)
* [Notes](#notes)
* [Migrating from vue-occasions](#migrating-from-vue-occasions)
* [Development](#development)
* [Changelog](#changelog)
* [License](#license)

# Installation

## npm

`npm install occasions --save`

## Yarn

`yarn add occasions`

## Script tag

```
<script src="https://unpkg.com/occasions"></script>
```

# Usage

## JavaScript (any framework or none)

```
import occasions from "occasions"

occasions()
```

Call it once when your app starts, for example in your entry file, a React `useEffect`, or Svelte’s `onMount`.

On May the 4th, this will result in:

```
<body class="star-wars" data-occasion="star-wars">
```

Now you can leverage CSS and JavaScript as you wish in celebration of Star Wars Day.

`occasions()` also returns the occasion name (or `undefined`).

## Script tag

```
<script src="https://unpkg.com/occasions"></script>
<script>
  occasions()
</script>
```

If the script runs in `<head>`, tagging waits until `<body>` is available.

## Vue

```
import Occasions from "occasions/vue"

createApp(App)
  .use(Occasions)
  .mount("#app")
```

The Vue plugin accepts all the same options as a second argument to `.use()`.

## CommonJS

```
const { occasions } = require("occasions")
```

## Without the DOM

To get today’s occasion without tagging anything, for example during server-side rendering:

```
import { getOccasion } from "occasions"

const occasion = getOccasion() // e.g. "star-wars" or undefined
```

`getOccasion` accepts the `occasions` and `date` options.

# Options

## Custom occasions

You can add your own occasions by supplying a JSON object during initialization:
```
occasions({
  occasions: {
    "Feb 27":"birthday"
  }
})
```

Note: if an occasion already exists for the date you provide, your custom occasion will be given priority.

## Date

To simulate an occasion without having to time travel, pass in a relevant date with your initialization:

```
occasions({ date: "Apr 01" })
```

This is intended for testing purposes only. Be sure to remove the date override once you have completed testing.

## Log occasions

To log all available occasions to the console, provide the `log` option:

```
occasions({ log: true })
```

## onOccasion callback

When an occasion is found, the `onOccasion` callback runs with the occasion name.

```
occasions({
  onOccasion: (occasion) => {
    // add your callback code here
  }
})
```

## Element

To tag an element other than `<body>`, pass its ID as `element`:

```
occasions({ element: "app" })
```

This tags `<div id="app">` instead of `<body>`. A leading `#` is optional. If the element isn’t in the page yet, tagging waits until the page has loaded. If no element has that ID, a warning is logged and nothing is tagged.

If you already have a reference to the element, pass it as `target` instead:

```
occasions({ target: document.querySelector(".site-header") })
```

`target` takes priority over `element` if both are given.

# Extras

## Special dates

Four special date functions are available: `nthDay()`, `lastWeekday()`, `weekdayAfter()` and `weekdayBefore()`. Use these as follows:

The first Monday of February:
```
{
  "_nthDay(1,Mon,Feb)":"happy-day"
}
```

The last Monday of May:
```
{
  "_lastWeekday(Mon,May)":"memorial"
}
```

The Tuesday after June 14:
```
{
  "_weekdayAfter(Tue,Jun,14)":"knitting-group"
}
```

The Tuesday before February 27:
```
{
  "_weekdayBefore(Tue,Feb,27)":"slappy-day"
}
```

Don’t miss those double-quotes.

## Current occasion

You can retrieve the current occasion that is attached to your element with:

```
document.querySelector("body").getAttribute("data-occasion")
```

# Examples

## Star Wars Day

Let’s trigger a JavaScript alert when simulating May 4th:
```
occasions({
  date: "May 04",
  onOccasion: (occasion) => {
    if (occasion === "star-wars") {
      alert("May the Fourth be with you.")
    }
  }
})
```

## Book club

A book club meets on the last Friday of every other month. On those Fridays, their website displays a reminder badge.

Their initialization looks like this:

```
occasions({
  occasions: {
    "_lastWeekday(Fri,Jan)":"book-club-meeting",
    "_lastWeekday(Fri,Mar)":"book-club-meeting",
    "_lastWeekday(Fri,May)":"book-club-meeting",
    "_lastWeekday(Fri,Jul)":"book-club-meeting",
    "_lastWeekday(Fri,Sep)":"book-club-meeting",
    "_lastWeekday(Fri,Nov)":"book-club-meeting"
  }
})
```

In their CSS, they have:

```
#meeting-tonight {
  display: none;
}
body.book-club-meeting #meeting-tonight {
  display: block;
}
```

# Notes

## Occasion name format

Since occasion names are used for CSS classes, they must follow the [syntax rules](https://developer.mozilla.org/en-US/docs/Web/CSS/Class_selectors). The occasions provided (`occasions.json`) use hyphenated names.

## Date format

Names of months and weekdays must be their first three letters, title cased. Eg: `Jan`, `Feb`, `Mon` and `Tue`.

Days must be two digits, so some need leading zeroes. Eg: `08`, `09`, `10`, `11`, etc.

# Migrating from vue-occasions

`vue-occasions` is now `occasions`. To upgrade a Vue app:

```
npm uninstall vue-occasions
npm install occasions
```

```
- import VueOccasions from "vue-occasions"
+ import Occasions from "occasions/vue"
```

Options are unchanged. `onOccasion` now receives the occasion name as its argument.

# Development

Install dependencies:

```
npm install
```

## Running tests

Tests use [Vitest](https://vitest.dev) and live in `tests/`.

Run the tests in watch mode (re-runs when files change):

```
npm test
```

Run the tests once and exit:

```
npx vitest run
```

Generate a coverage report (output to `coverage/`):

```
npm run coverage
```

## Building

```
npm run build
```

This outputs the ESM, CommonJS and `<script>` tag builds to `dist/`.

# Changelog

## Apr 7, 2023 v1.0.4

* Core functionality
* Test suite

## Apr 8, 2023 v1.1.1

* Add `log` option to log available occasions to console

## Sep 29, 2026 v2.0.0

* Renamed from `vue-occasions` to `occasions`
* Framework-agnostic core: `occasions()` and `getOccasion()`
* Vue plugin moved to `occasions/vue`
* ESM, CommonJS and `<script>` tag builds, plus TypeScript types
* New `target` option; `onOccasion` receives the occasion name
* Works without options and without a DOM (SSR)
* No longer depends on Vue

# License

[The MIT License](http://opensource.org/licenses/MIT)
