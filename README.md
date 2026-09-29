# occasions

Tags your HTML’s body element with a class and data attribute reflecting today’s occasion or holiday. You can then style that element with CSS or implement some JavaScript behaviour. For example, you could show special versions of your site’s logo on different holidays or trigger a holiday-specific modal.

Works anywhere: plain JavaScript, a `<script>` tag, or any framework, including Vue, React, Svelte, Angular and Astro.

[![Version](https://img.shields.io/npm/v/occasions?style=flat-square)](https://www.npmjs.com/package/occasions)
[![MIT License](https://img.shields.io/packagist/l/doctrine/orm.svg?style=flat-square)](https://www.npmjs.com/package/occasions)
[![Minified Size](https://img.shields.io/bundlephobia/min/occasions?color=%23F18F01&style=flat-square)](https://www.npmjs.com/package/occasions)

# Table of Contents
* [Installation](#installation)
* [Usage](#usage)
* [Frameworks](#frameworks)
* [Options](#options)
* [Extras](#extras)
* [Examples](#examples)
* [Notes](#notes)
* [Migrating from 2.x](#migrating-from-2x)
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

occasions({
  occasions: {
    "May 04":"star-wars",
    "Oct 31":"halloween"
  }
})
```

Call it once when your page loads. See [Frameworks](#frameworks) for where that goes in Vue, React, Next.js and others.

On May the 4th, this will result in:

```
<body class="occasion-star-wars" data-occasion="star-wars">
```

Now you can leverage CSS and JavaScript as you wish in celebration of Star Wars Day.

`occasions()` also returns the occasion name (or `undefined`).

## Presets

A list of about 70 ready-made occasions (holidays, awareness days and geeky celebrations) is available as presets. Presets aren’t included unless you import them, which keeps the core package small.

```
import occasions from "occasions"
import presets from "occasions/presets"

occasions({ occasions: presets })
```

Mix presets with your own occasions. Later keys win, so your occasions override presets on the same date:

```
occasions({
  occasions: {
    ...presets,
    "Feb 27":"birthday"
  }
})
```

To see what’s included, browse [`src/occasions.json`](src/occasions.json) or use the [`log`](#log-occasions) option. You can also copy just the entries you want into your own list.

## Script tag

```
<script src="https://unpkg.com/occasions"></script>
<script>
  occasions({ occasions: occasions.presets })
</script>
```

The script tag build includes the presets as `occasions.presets`. If the script runs in `<head>`, tagging waits until `<body>` is available.

## CommonJS

```
const { occasions } = require("occasions")
```

## Without the DOM

To get today’s occasion without tagging anything, for example during server-side rendering:

```
import { getOccasion } from "occasions"

const occasion = getOccasion({ occasions: presets }) // e.g. "star-wars" or undefined
```

`getOccasion` accepts the `occasions` and `date` options.

# Frameworks

`occasions()` works the same way in every framework: call it once, in the browser, after your app has started. No plugin or wrapper is needed. The examples below show where that call goes. They all use presets, but any [options](#options) work.

## Vue

```
// main.js
import { createApp } from "vue"
import occasions from "occasions"
import presets from "occasions/presets"
import App from "./App.vue"

createApp(App).mount("#app")
occasions({ occasions: presets })
```

## Nuxt

Use a client-only plugin (note the `.client` in the file name) so it runs in the browser:

```
// plugins/occasions.client.js
import occasions from "occasions"
import presets from "occasions/presets"

export default defineNuxtPlugin(() => {
  occasions({ occasions: presets })
})
```

## React

```
// App.jsx
import { useEffect } from "react"
import occasions from "occasions"
import presets from "occasions/presets"

export default function App() {
  useEffect(() => {
    occasions({ occasions: presets })
  }, [])

  // ...
}
```

In development, React’s Strict Mode runs effects twice, so `onOccasion` fires twice. This doesn’t happen in production.

## Next.js

Effects only run in client components, so put the call in a small component marked `"use client"`:

```
// app/Occasions.jsx
"use client"
import { useEffect } from "react"
import occasions from "occasions"
import presets from "occasions/presets"

export default function Occasions() {
  useEffect(() => {
    occasions({ occasions: presets })
  }, [])
  return null
}
```

Then render it in your root layout:

```
// app/layout.jsx
import Occasions from "./Occasions"

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Occasions />
        {children}
      </body>
    </html>
  )
}
```

## Svelte and SvelteKit

```
<!-- App.svelte, or src/routes/+layout.svelte in SvelteKit -->
<script>
  import { onMount } from "svelte"
  import occasions from "occasions"
  import presets from "occasions/presets"

  onMount(() => {
    occasions({ occasions: presets })
  })
</script>
```

## Angular

```
// main.ts
import { bootstrapApplication } from "@angular/platform-browser"
import occasions from "occasions"
import presets from "occasions/presets"
import { AppComponent } from "./app/app.component"

bootstrapApplication(AppComponent).then(() => {
  occasions({ occasions: presets })
})
```

## Astro

Astro bundles `<script>` tags and runs them in the browser, so add one to your layout:

```
<!-- src/layouts/Layout.astro -->
<html lang="en">
  <body>
    <slot />
    <script>
      import occasions from "occasions"
      import presets from "occasions/presets"

      occasions({ occasions: presets })
    </script>
  </body>
</html>
```

## Server-side rendering

In frameworks that render on the server (Nuxt, Next.js, SvelteKit, Astro), the examples above run in the browser, so the occasion is based on the visitor’s own date. The class is added once the page loads, so occasion styles appear a moment after the page first shows. Calling `occasions()` on the server is harmless; it finds the occasion but has nothing to tag.

To add the class during server rendering instead, use [`getOccasion()`](#without-the-dom) and put the result on `<body>` yourself. Keep in mind that this uses the server’s date and timezone, and a cached or statically built page keeps the occasion from when it was built.

# Options

## Occasions

The occasions to look for, keyed by date:
```
occasions({
  occasions: {
    "Feb 27":"birthday"
  }
})
```

Dates can also be [special dates](#special-dates) like “the last Monday of May”. See [Presets](#presets) for a ready-made list.

## Date

To simulate an occasion without having to time travel, pass in a relevant date with your initialization:

```
occasions({ occasions: presets, date: "Apr 01" })
```

This is intended for testing purposes only. Be sure to remove the date override once you have completed testing.

## Log occasions

To log all available occasions to the console, provide the `log` option:

```
occasions({ occasions: presets, log: true })
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

## Class prefix

The class added to the element is prefixed with `occasion-` so it won’t collide with class names already used in your site’s CSS. For example, the `star-wars` occasion adds the class `occasion-star-wars`. To use a different prefix, pass `prefix`:

```
occasions({ occasions: presets, prefix: "holiday-" })
```

This results in `<body class="holiday-star-wars" data-occasion="star-wars">`. Pass `prefix: ""` for no prefix.

The prefix only applies to the class. The `data-occasion` attribute, the return value and `onOccasion` always use the plain occasion name.

# Extras

## Special dates

Four special date functions are available: `nthDay()`, `lastWeekday()`, `weekdayAfter()` and `weekdayBefore()`. Use these as follows:

The first Monday of February:
```
{
  "nthDay(1,Mon,Feb)":"happy-day"
}
```

The last Monday of May:
```
{
  "lastWeekday(Mon,May)":"memorial"
}
```

The Tuesday after June 14:
```
{
  "weekdayAfter(Tue,Jun,14)":"knitting-group"
}
```

The Tuesday before February 27:
```
{
  "weekdayBefore(Tue,Feb,27)":"slappy-day"
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
  occasions: presets,
  date: "May 4",
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
    "lastWeekday(Fri,Jan)":"book-club-meeting",
    "lastWeekday(Fri,Mar)":"book-club-meeting",
    "lastWeekday(Fri,May)":"book-club-meeting",
    "lastWeekday(Fri,Jul)":"book-club-meeting",
    "lastWeekday(Fri,Sep)":"book-club-meeting",
    "lastWeekday(Fri,Nov)":"book-club-meeting"
  }
})
```

In their CSS, they have:

```
#meeting-tonight {
  display: none;
}
body.occasion-book-club-meeting #meeting-tonight {
  display: block;
}
```

# Notes

## Occasion name format

Since occasion names are used for CSS classes, they must follow the [syntax rules](https://developer.mozilla.org/en-US/docs/Web/CSS/Class_selectors). The same goes for a custom [prefix](#class-prefix). The presets use hyphenated names.

## Styling with the data attribute

Instead of the class, you can target the `data-occasion` attribute, which never needs a prefix:

```
body[data-occasion="star-wars"] .logo {
  background-image: url("logo-star-wars.svg");
}
```

## Date format

Names of months and weekdays must be their first three letters. Eg: `Jan`, `Feb`, `Mon` and `Tue`.

Everything is case-insensitive: months, weekdays and special-date function names. Eg: `sep 25` and `Sep 25` are equivalent, as are `lastweekday(fri,sep)` and `lastWeekday(Fri,Sep)`.

Days may be written with or without a leading zero. Eg: `May 4` and `May 04` are equivalent.

# Migrating from 2.x

Version 3 has three breaking changes.

**The built-in occasions are now opt-in.** Calling `occasions()` without an `occasions` option no longer tags anything. To keep the previous behaviour, pass the presets:

```
import presets from "occasions/presets"

occasions({ occasions: presets })
```

Your own occasions previously overrode built-in ones on the same date. To keep that, spread presets first:

```
occasions({ occasions: { ...presets, "Feb 27":"birthday" } })
```

**Classes are now prefixed with `occasion-`.** `<body class="star-wars">` is now `<body class="occasion-star-wars">`. Either update your CSS selectors (`.star-wars` → `.occasion-star-wars`) or keep the old class names with `prefix: ""`. The `data-occasion` attribute is unchanged.

**The Vue plugin (`occasions/vue`) has been removed.** Call `occasions()` directly instead. See [Vue](#vue):

```
- import Occasions from "occasions/vue"
+ import occasions from "occasions"

- createApp(App).use(Occasions, options).mount("#app")
+ createApp(App).mount("#app")
+ occasions(options)
```

# Migrating from vue-occasions

`vue-occasions` is now `occasions`. To upgrade a Vue app:

```
npm uninstall vue-occasions
npm install occasions
```

`occasions` doesn’t need a Vue plugin. Call it after mounting your app instead:

```
- import VueOccasions from "vue-occasions"
+ import occasions from "occasions"
+ import presets from "occasions/presets"

- createApp(App).use(VueOccasions).mount("#app")
+ createApp(App).mount("#app")
+ occasions({ occasions: presets })
```

The options are the same, with these differences:

* Custom occasions: spread them after the presets, e.g. `{ occasions: { ...presets, "Feb 27":"birthday" } }`.
* Classes are prefixed with `occasion-`. Update your CSS or pass `prefix: ""` to keep the old class names.
* `onOccasion` now receives the occasion name as its argument.
* Special date functions no longer take a leading underscore: `"_nthDay(1,Mon,Feb)"` is now `"nthDay(1,Mon,Feb)"`.

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

## Sep 29, 2026 v3.0.0

* **Breaking:** built-in occasions are no longer included by default. Import them from `occasions/presets`
* **Breaking:** classes are prefixed with `occasion-` by default. New `prefix` option to change or remove it
* **Breaking:** removed the Vue plugin (`occasions/vue`). Call `occasions()` directly in any framework
* New Frameworks section in the docs with examples for Vue, Nuxt, React, Next.js, Svelte, Angular and Astro
* New `element` option to tag an element by ID instead of `<body>`
* Script tag build exposes presets as `occasions.presets`
* Smaller core bundle

# License

[The MIT License](http://opensource.org/licenses/MIT)
