import { describe, test, expect, vi, afterEach } from "vitest";
import occasions, { getOccasion } from "../src/index";
import Occasions from "../src/vue";
import browser from "../src/browser";

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

describe("with a DOM", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  })

  test("tags document.body by default", () => {
    const body = fakeElement();
    vi.stubGlobal("document", { body });
    occasions({ date: "May 04" });
    expect(body.dataset.occasion).toEqual("star-wars");
  })

  test("waits for DOMContentLoaded when there is no body yet", () => {
    let ready;
    const doc = { body: null, addEventListener: vi.fn((event, callback) => { ready = callback }) };
    vi.stubGlobal("document", doc);
    const onOccasion = vi.fn();
    expect(occasions({ date: "May 04", onOccasion })).toEqual("star-wars");
    expect(doc.addEventListener).toHaveBeenCalledWith("DOMContentLoaded", expect.any(Function), { once: true });
    expect(onOccasion).not.toHaveBeenCalled();
    doc.body = fakeElement();
    ready();
    expect(doc.body.dataset.occasion).toEqual("star-wars");
    expect(onOccasion).toHaveBeenCalledWith("star-wars");
  })
})

test("occasions calls onOccasion without a DOM", () => {
  const onOccasion = vi.fn();
  occasions({ date: "May 04", onOccasion });
  expect(onOccasion).toHaveBeenCalledWith("star-wars");
})

test("occasions with no occasion today", () => {
  const target = fakeElement();
  const onOccasion = vi.fn();
  expect(occasions({ date: "Feb 29", target, onOccasion })).toBeUndefined();
  expect(target.classList.add).not.toHaveBeenCalled();
  expect(onOccasion).not.toHaveBeenCalled();
})

test("getOccasion without options", () => {
  expect(getOccasion()).toEqual(occasions({ target: fakeElement() }));
})

test("log option", () => {
  const log = vi.spyOn(console, "log").mockImplementation(() => {});
  const group = vi.spyOn(console, "groupCollapsed").mockImplementation(() => {});
  const groupEnd = vi.spyOn(console, "groupEnd").mockImplementation(() => {});
  occasions({ date: "Jan 01", log: true, occasions: { "Feb 27": "birthday" }, target: fakeElement() });
  expect(group).toHaveBeenCalledWith("[occasions] available occasions...");
  const lines = log.mock.calls.map(([line]) => line);
  expect(lines[0]).toEqual("Jan 01: new-years");
  expect(lines).toContain("Feb 27: birthday");
  expect(groupEnd).toHaveBeenCalled();
  vi.restoreAllMocks();
})

test("script tag build", () => {
  expect(browser).toBe(occasions);
  expect(browser.getOccasion({ date: "May 04" })).toEqual("star-wars");
})
