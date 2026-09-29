import { test, expect, vi, afterEach } from "vitest";
import * as core from "../../src/core/index";

const date = new Date();

test("today's date", () => {
  const formattedDate = `${core.monthName(date.getMonth())} ${date.getDate()}`
  expect(core.todaysDate(formattedDate)).toEqual(formattedDate);
})

test("date override", () => {
  expect(core.todaysDate("Feb 27")).toEqual("Feb 27");
})

afterEach(() => {
  vi.useRealTimers();
})

test("today's date is padded to two digits", () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2024, 2, 5));
  expect(core.todaysDate()).toEqual("Mar 05");
  vi.setSystemTime(new Date(2024, 10, 15));
  expect(core.todaysDate()).toEqual("Nov 15");
})
