import { test, expect } from "vitest";
import * as core from "../../src/core/index";

test("nthDay", () => {
  expect(core.specialDate("nthDay(4,Mon,Feb,2023)")).toEqual("Feb 27");
  expect(core.specialDate("nthDay(4,Mon,Feb,2024)")).toEqual("Feb 26");
  expect(core.specialDate("nthDay(4,Mon,Feb,2025)")).toEqual("Feb 24");
  expect(core.specialDate("nthDay(1,Tue,Jan,1999)")).toEqual("Jan 05");
  expect(core.specialDate("nthDay(2,Wed,Aug,1979)")).toEqual("Aug 08");
  expect(core.specialDate("nthDay(3,Sun,Dec,2000)")).toEqual("Dec 17");
})

test("weekdayAfter", () => {
  expect(core.specialDate("weekdayAfter(Mon,Feb,1,2023)")).toEqual("Feb 06");
  expect(core.specialDate("weekdayAfter(Tue,Feb,5,2024)")).toEqual("Feb 06");
  expect(core.specialDate("weekdayAfter(Wed,Feb,10,2025)")).toEqual("Feb 12");
  expect(core.specialDate("weekdayAfter(Thu,Jan,15,1999)")).toEqual("Jan 21");
  expect(core.specialDate("weekdayAfter(Fri,Aug,28,1979)")).toEqual("Aug 31");
  expect(core.specialDate("weekdayAfter(Sun,Dec,31,2000)")).toEqual("Jan 07");
})

test("weekdayBefore", () => {
  expect(core.specialDate("weekdayBefore(Mon,Feb,1,2023)")).toEqual("Jan 30");
  expect(core.specialDate("weekdayBefore(Tue,Feb,5,2024)")).toEqual("Jan 30");
  expect(core.specialDate("weekdayBefore(Wed,Feb,10,2025)")).toEqual("Feb 05");
  expect(core.specialDate("weekdayBefore(Thu,Jan,15,1999)")).toEqual("Jan 14");
  expect(core.specialDate("weekdayBefore(Fri,Aug,28,1979)")).toEqual("Aug 24");
  expect(core.specialDate("weekdayBefore(Sun,Dec,31,2000)")).toEqual("Dec 24");
})

test("lastWeekday", () => {
  expect(core.specialDate("lastWeekday(Mon,Feb,2023)")).toEqual("Feb 27");
  expect(core.specialDate("lastWeekday(Tue,Feb,2024)")).toEqual("Feb 27");
  expect(core.specialDate("lastWeekday(Wed,Feb,2025)")).toEqual("Feb 26");
  expect(core.specialDate("lastWeekday(Thu,Jan,1999)")).toEqual("Jan 28");
  expect(core.specialDate("lastWeekday(Fri,Aug,1979)")).toEqual("Aug 31");
  expect(core.specialDate("lastWeekday(Sun,Dec,2000)")).toEqual("Dec 31");
})

test("lastWeekday", () => {
  expect(core.specialDate("lastWeekday(Mon,May,2023)")).toEqual("May 29");
  expect(core.specialDate("lastWeekday(Fri,May,2023)")).toEqual("May 26");
  expect(core.specialDate("lastWeekday(Wed,May,2023)")).toEqual("May 31");
  expect(core.specialDate("lastWeekday(Sat,Feb,2024)")).toEqual("Feb 24");
})

test("special dates default to the current year", () => {
  const year = new Date().getFullYear();
  expect(core.specialDate("lastWeekday(Fri,Nov)")).toEqual(core.specialDate(`lastWeekday(Fri,Nov,${year})`));
  expect(core.specialDate("weekdayAfter(Tue,Jun,14)")).toEqual(core.specialDate(`weekdayAfter(Tue,Jun,14,${year})`));
  expect(core.specialDate("weekdayBefore(Tue,Feb,27)")).toEqual(core.specialDate(`weekdayBefore(Tue,Feb,27,${year})`));
  expect(core.specialDate("nthDay(1,Mon,Feb)")).toEqual(core.specialDate(`nthDay(1,Mon,Feb,${year})`));
})

test("special dates are case-insensitive", () => {
  expect(core.specialDate("nthday(4,mon,feb,2023)")).toEqual("Feb 27");
  expect(core.specialDate("WEEKDAYAFTER(MON,FEB,1,2023)")).toEqual("Feb 06");
  expect(core.specialDate("weekdaybefore(mon,feb,1,2023)")).toEqual("Jan 30");
  expect(core.specialDate("lastweekday(fri,may,2023)")).toEqual("May 26");
})

test("plain dates aren't special dates", () => {
  expect(core.specialDate("Feb 27")).toBeUndefined();
  expect(core.specialDate("unknown(Mon,Feb)")).toBeUndefined();
  expect(core.specialDate("_nthDay(1,Mon,Feb)")).toBeUndefined();
})

test("unknown special date", () => {
  expect(core.specialDate("_unknown(Mon,Feb)")).toBeUndefined();
})
