import { nthDay } from "./nthDay"
import { lastWeekday, weekdayAfter, weekdayBefore } from "./weekday"

// function names are case-insensitive
const specialDates = {
  nthday: nthDay,
  weekdayafter: weekdayAfter,
  weekdaybefore: weekdayBefore,
  lastweekday: lastWeekday,
};

// returns the resolved date, or undefined if the key isn't a special date
const specialDate = (date, override) => {

  const match = date.match(/^(\w+)\((.*)\)$/);
  const fn = match && specialDates[match[1].toLowerCase()];

  return fn ? fn(match[2], override) : undefined;
};

export { specialDate }
