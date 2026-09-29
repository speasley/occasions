import { test, expect, vi } from "vitest";
import occasions, { getOccasion } from "../src/index";
import Occasions from "../src/vue";

const fakeElement = () => ({ classList: { add: vi.fn() }, dataset: {} });

test("getOccasion", () => {
  expect(getOccasion({ date: "May 04" })).toEqual("star-wars");
  expect(getOccasion({ date: "Sep 25" })).toEqual("dolly-day");
  expect(getOccasion({ date: "Feb 27", occasions: { "Feb 27": "birthday" } })).toEqual("birthday");
  expect(getOccasion({ date: "Feb 29" })).toBeUndefined();
})

test("custom occasions don't leak between calls", () => {
  getOccasion({ date: "Feb 27", occasions: { "Feb 27": "birthday" } });
  expect(getOccasion({ date: "Feb 27" })).toBeUndefined();
})

test("occasions tags the target and calls onOccasion", () => {
  const target = fakeElement();
  const onOccasion = vi.fn();
  expect(occasions({ date: "Apr 01", target, onOccasion })).toEqual("april-fools");
  expect(target.classList.add).toHaveBeenCalledWith("april-fools");
  expect(target.dataset.occasion).toEqual("april-fools");
  expect(onOccasion).toHaveBeenCalledWith("april-fools");
})

test("occasions without a DOM or options", () => {
  expect(() => occasions()).not.toThrow();
  expect(occasions({ date: "Mar 14" })).toEqual("pi");
})

test("vue plugin", () => {
  const target = fakeElement();
  Occasions.install({}, { date: "Mar 14", target });
  expect(target.dataset.occasion).toEqual("pi");
})
